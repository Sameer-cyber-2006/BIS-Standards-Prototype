package com.example.bisassistant.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "standards")
public class Standard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "is_number", nullable = false)
    private String isNumber;

    @Column(nullable = false)
    private String title;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String scope;

    @Column(name = "version_year")
    private Integer versionYear;

    private String status;

    @Column(name = "source_url", columnDefinition = "TEXT")
    private String sourceUrl;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Standard() {
    }

    public Integer getId() {
        return id;
    }

    public String getIsNumber() {
        return isNumber;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public String getScope() {
        return scope;
    }

    public Integer getVersionYear() {
        return versionYear;
    }

    public String getStatus() {
        return status;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public LocalDate getPublicationDate() {
        return publicationDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setIsNumber(String isNumber) {
        this.isNumber = isNumber;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public void setVersionYear(Integer versionYear) {
        this.versionYear = versionYear;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public void setPublicationDate(LocalDate publicationDate) {
        this.publicationDate = publicationDate;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}