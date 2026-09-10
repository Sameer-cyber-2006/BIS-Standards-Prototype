import React from 'react'
import { Lightbulb } from 'lucide-react'

// Small callout used throughout the app to clearly separate what this
// prototype actually does from what is planned as a future integration.
export default function FutureNote({ children }) {
  return (
    <div className="future-note">
      <Lightbulb size={15} />
      <div>{children}</div>
    </div>
  )
}
