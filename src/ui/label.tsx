import React from 'react'

export const Label = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
  <label className="block text-gray-700 mb-2" {...props}>
    {children}
  </label>
)