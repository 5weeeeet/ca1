import React from 'react'

export const RadioGroup = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
  <div className="space-y-2" {...props}>
    {children}
  </div>
)

export const RadioGroupItem = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
  <label className="flex items-center space-x-2">
    <input type="radio" className="border-gray-300 text-blue-600 focus:ring-blue-500" {...props} />
    {children}
  </label>
)