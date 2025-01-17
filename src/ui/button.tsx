import React from 'react'

export const Button = ({ children, variant = 'default', ...props }: { children: React.ReactNode, variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link', [key: string]: any }) => {
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
    ghost: 'bg-transparent text-gray-800 hover:bg-gray-100',
    link: 'bg-transparent text-blue-500 hover:underline',
  }

  return (
    <button className={`px-4 py-2 rounded ${variants[variant]}`} {...props}>
      {children}
    </button>
  )
}