import React from 'react'

export const Input = ({ ...props }: { [key: string]: any }) => (
  <input className="border border-gray-300 rounded px-4 py-2 w-full" {...props} />
)