import { useState } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
import React from 'react'
import Input from './ui/input'

export default function VideoChat() {
  const [isSearching, setIsSearching] = useState(false)

  const toggleSearch = () => {
    setIsSearching(!isSearching)
  }

  const nextUser = () => {
    // Logic to switch to the next user
    console.log('Switching to the next user')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Video Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="w-full h-96 bg-gray-200 border-2 border-dashed rounded-xl">
          {/* Placeholder for video stream */}
        </div>
        <div className="flex space-x-4">
          <Button onClick={toggleSearch}>
            {isSearching ? 'Stop Search' : 'Start Search'}
          </Button>
          <Button onClick={nextUser}>
            Next User
          </Button>
        </div>
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <div className="bg-gray-100 p-2 rounded">
                <p>User: Hello!</p>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <p>You: Hi there!</p>
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Input type="text" placeholder="Type a message..." />
              <Button>Send</Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}