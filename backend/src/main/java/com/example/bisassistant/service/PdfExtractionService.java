package com.example.bisassistant.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 * Extracts text from an uploaded procurement PDF.
 *
 * Two-stage strategy:
 *
 * 1. PDFBox
 *    Extracts text directly from PDFs that already contain a text layer.
 *
 * 2. Tesseract OCR
 *    If PDFBox cannot extract enough text, the PDF pages are converted
 *    into images and Tesseract OCR is used to extract the text.
 */
@Service
public class PdfExtractionService {

    private static final Logger log =
            LoggerFactory.getLogger(PdfExtractionService.class);

    /**
     * If PDFBox extracts less than this many characters,
     * OCR will be used as a fallback.
     */
    private static final int MIN_TEXT_LENGTH_BEFORE_OCR = 40;

    /**
     * Maximum number of pages to process using OCR.
     * This prevents very large PDFs from taking too long.
     */
    private static final int MAX_OCR_PAGES = 15;

    /**
     * Windows Tesseract tessdata folder.
     *
     * Example:
     * C:\Program Files\Tesseract-OCR\tessdata
     *
     * Forward slashes are used because they work safely in Java strings.
     */
    @Value("${ocr.tessdata-path:C:/Program Files/Tesseract-OCR/tessdata}")
    private String tessdataPath;

    /**
     * OCR language.
     */
    @Value("${ocr.language:eng}")
    private String ocrLanguage;

    /**
     * Result returned after PDF extraction.
     */
    public static class ExtractionResult {

        public final String text;
        public final boolean usedOcr;
        public final int pageCount;

        public ExtractionResult(
                String text,
                boolean usedOcr,
                int pageCount) {

            this.text = text;
            this.usedOcr = usedOcr;
            this.pageCount = pageCount;
        }
    }

    /**
     * Extract text from PDF.
     */
    public ExtractionResult extract(byte[] pdfBytes) {

        try (PDDocument document = PDDocument.load(pdfBytes)) {

            // Check whether PDF is password protected.
            if (document.isEncrypted()) {

                throw new IllegalArgumentException(
                        "This PDF is password-protected. " +
                        "Please upload an unlocked PDF."
                );
            }

            int pageCount = document.getNumberOfPages();

            // ---------------------------------------------------------
            // STEP 1: Try normal PDF text extraction using PDFBox
            // ---------------------------------------------------------

            PDFTextStripper stripper = new PDFTextStripper();

            String directText =
                    stripper.getText(document).trim();

            if (directText.length() >= MIN_TEXT_LENGTH_BEFORE_OCR) {

                log.info(
                        "Extracted {} characters using PDFBox " +
                        "from {} pages. OCR not required.",
                        directText.length(),
                        pageCount
                );

                return new ExtractionResult(
                        directText,
                        false,
                        pageCount
                );
            }

            // ---------------------------------------------------------
            // STEP 2: PDFBox found very little text -> OCR
            // ---------------------------------------------------------

            log.info(
                    "PDFBox extracted only {} characters. " +
                    "Starting Tesseract OCR for {} pages.",
                    directText.length(),
                    pageCount
            );

            String ocrText = runOcr(document);

            String combinedText =
                    (directText + "\n" + ocrText).trim();

            if (combinedText.isEmpty()) {

                throw new IllegalArgumentException(
                        "Could not extract any text from this PDF, " +
                        "even with OCR. The scan quality may be too low."
                );
            }

            return new ExtractionResult(
                    combinedText,
                    true,
                    pageCount
            );

        } catch (IOException e) {

            throw new IllegalArgumentException(
                    "Could not read this PDF. " +
                    "It may be corrupted or in an unsupported format.",
                    e
            );
        }
    }

    /**
     * Run Tesseract OCR on PDF pages.
     */
    private String runOcr(PDDocument document) {

        // ---------------------------------------------------------
        // Create Tesseract instance
        // ---------------------------------------------------------

        Tesseract tesseract = new Tesseract();

        // Windows tessdata path
        tesseract.setDatapath(tessdataPath);

        // English language
        tesseract.setLanguage(ocrLanguage);

        // ---------------------------------------------------------
        // Convert PDF pages to images
        // ---------------------------------------------------------

        PDFRenderer renderer =
                new PDFRenderer(document);

        StringBuilder ocrText =
                new StringBuilder();

        int pagesToRead =
                Math.min(
                        document.getNumberOfPages(),
                        MAX_OCR_PAGES
                );

        // ---------------------------------------------------------
        // OCR each page
        // ---------------------------------------------------------

        for (int pageIndex = 0;
             pageIndex < pagesToRead;
             pageIndex++) {

            try {

                log.info(
                        "Running OCR on page {} of {}",
                        pageIndex + 1,
                        pagesToRead
                );

                // Render PDF page at 300 DPI.
                BufferedImage pageImage =
                        renderer.renderImageWithDPI(
                                pageIndex,
                                300
                        );

                // Run Tesseract OCR.
                String pageText =
                        tesseract.doOCR(pageImage);

                if (pageText != null && !pageText.isBlank()) {

                    ocrText
                            .append(pageText)
                            .append("\n");
                }

            } catch (IOException e) {

                log.warn(
                        "Could not render page {} for OCR: {}",
                        pageIndex + 1,
                        e.getMessage()
                );

            } catch (TesseractException e) {

                log.error(
                        "Tesseract OCR failed on page {}: {}",
                        pageIndex + 1,
                        e.getMessage()
                );

                throw new IllegalArgumentException(
                        "OCR is not available on this server right now. " +
                        "Make sure Tesseract and the tessdata language " +
                        "files are installed correctly.",
                        e
                );
            }
        }

        return ocrText
                .toString()
                .trim();
    }
}