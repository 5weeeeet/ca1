import React from 'react'

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">
    {children}
  </div>
)

export const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-bold">
    {children}
  </h3>
)

export const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-500">
    {children}
  </p>
)

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">
    {children}
  </div>
)

export const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end">
    {children}
  </div>
)