import { useState } from 'react'
import RegistrationForm from './src/components/registration-form'
import VideoChat from './src/components/video-chat'
import FilterPanel from './src/components/filter-panel'
import { Button } from "./src/components/ui/button"
import React from 'react'

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false)

  const handleRegistrationSuccess = () => {
    setIsRegistered(true)
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      {isRegistered ? (
        <div className="flex flex-col items-center space-y-4">
          <VideoChat />
          <FilterPanel />
          <Button variant="outline" onClick={() => setIsRegistered(false)}>
            Back to Registration
          </Button>
        </div>
      ) : (
        <RegistrationForm onRegister={handleRegistrationSuccess} />
      )}
    </div>
  )
}