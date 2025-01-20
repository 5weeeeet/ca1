import React from 'react'

export interface SelectValueProps {
  placeholder?: string
  children?: React.ReactNode
}

export default function SelectValue({ placeholder, children }: SelectValueProps) {
  return (
    <span className="text-muted-foreground">
      {children ? children : placeholder}
    </span>
  )
}