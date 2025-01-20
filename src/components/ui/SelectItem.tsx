import React from 'react'
import { CommandItem } from "@/components/ui/command"
import { Check } from "lucide-react"

export interface SelectItemProps {
  value: string
  children: React.ReactNode
  onSelect: (value: string) => void
}

export default function SelectItem({ value, children, onSelect }: SelectItemProps) {
  return (
    <CommandItem
      value={value}
      onSelect={onSelect}
      className="text-sm"
    >
      {children}
      <Check className="ml-auto h-4 w-4" />
    </CommandItem>
  )
}