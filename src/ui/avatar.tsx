import React from 'react'

export const Avatar = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block">
    {children}
  </div>
)

export const AvatarImage = ({ src }: { src: string }) => (
  <img src={src} alt="Avatar" className="w-10 h-10 rounded-full" />
)

export const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
    {children}
  </div>
)