import React from 'react'

export const Select = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
  <div className="relative" {...props}>
    {children}
  </div>
)

export const SelectTrigger = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
  <button className="border border-gray-300 rounded px-4 py-2 w-full" {...props}>
    {children}
  </button>
)

export const SelectValue = ({ children }: { children: React.ReactNode }) => (
  <span>
    {children}
  </span>
)

export const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute bg-white border border-gray-300 rounded mt-1 w-full">
    {children}
  </div>
)

export const SelectItem = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
  <button className="px-4 py-2 w-full text-left hover:bg-gray-100" {...props}>
    {children}
  </button>
)