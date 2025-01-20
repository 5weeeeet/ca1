import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"

export interface SelectTriggerProps {
  children: React.ReactNode
}

export default function SelectTrigger({ children }: SelectTriggerProps) {
  return (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={false}
      className="w-full justify-between"
    >
      {children}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )
}