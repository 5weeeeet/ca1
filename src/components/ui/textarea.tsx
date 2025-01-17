import React from 'react'

export const Textarea = ({ ...props }: { [key: string]: any }) => (
  <textarea className="border border-gray-300 rounded px-4 py-2 w-full" {...props} />
)