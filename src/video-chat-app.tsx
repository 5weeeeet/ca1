import { SetStateAction, useState } from 'react'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { Textarea } from "./components/ui/textarea"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"

export default function VideoChatApp() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [username, setUsername] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [bio, setBio] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [age, setAge] = useState('')
  const [searchPurpose, setSearchPurpose] = useState('')
  const [matchedUser, setMatchedUser] = useState<{ username: string, profilePicture: string, bio: string } | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const handleRegister = () => {
    setIsRegistered(true)
  }

  const startSearch = () => {
    if (!isSearching) {
      setIsSearching(true)
      setMatchedUser(null)
      setNotification(null)

      // Simulate finding a matched user after a short delay
      const timeout = setTimeout(() => {
        // Simulate a search result
        const foundUser = findMatchedUser(gender, country, city, age, searchPurpose)
        if (foundUser) {
          setMatchedUser(foundUser)
        } else {
          setNotification('No users found matching your criteria.')
        }
        setIsSearching(false)
      }, 30000) // 30-second search time

      setSearchTimeout(timeout)
    }
  }

  const stopSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
      setSearchTimeout(null)
    }
    setIsSearching(false)
    setMatchedUser(null)
    setNotification(null)
  }

  const handleVideoCall = () => {
    if (matchedUser) {
      alert('Starting video call with ' + matchedUser.username)
    }
  }

  const handleTextChat = () => {
    if (matchedUser) {
      alert('Starting text chat with ' + matchedUser.username)
    }
  }

  const findMatchedUser = (gender: string, country: string, city: string, age: string, searchPurpose: string): { username: string, profilePicture: string, bio: string } | null => {
    // Simulate a database of users
    const users = [
      { username: 'RandomUser1', profilePicture: 'https://github.com/nutlope.png', bio: 'Just a random user!', gender: 'male', country: 'USA', city: 'New York', age: '25', searchPurpose: 'chat' },
      { username: 'RandomUser2', profilePicture: 'https://github.com/nutlope.png', bio: 'Just a random user!', gender: 'female', country: 'Canada', city: 'Toronto', age: '30', searchPurpose: 'make-friends' },
      { username: 'RandomUser3', profilePicture: 'https://github.com/nutlope.png', bio: 'Just a random user!', gender: 'other', country: 'UK', city: 'London', age: '28', searchPurpose: 'network' },
    ]

    // Filter users based on criteria
    const filteredUsers = users.filter(user => {
      return (
        (gender === '' || user.gender === gender) &&
        (country === '' || user.country === country) &&
        (city === '' || user.city === city) &&
        (age === '' || user.age === age) &&
        (searchPurpose === '' || user.searchPurpose === searchPurpose)
      )
    })

    // Return a random user from the filtered list
    if (filteredUsers.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredUsers.length)
      return filteredUsers[randomIndex]
    }

    return null
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      {!isRegistered ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Register via phone number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e: { target: { value: SetStateAction<string> } }) => setUsername(e.target.value)} placeholder="Enter your username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={phoneNumber} onChange={(e: { target: { value: SetStateAction<string> } }) => setPhoneNumber(e.target.value)} placeholder="Enter your phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-picture">Profile Picture URL</Label>
              <Input id="profile-picture" value={profilePicture} onChange={(e: { target: { value: SetStateAction<string> } }) => setProfilePicture(e.target.value)} placeholder="Enter your profile picture URL" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e: { target: { value: SetStateAction<string> } }) => setBio(e.target.value)} placeholder="Enter your bio" />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup value={gender} onValueChange={setGender}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" children={undefined} />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" children={undefined} />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" children={undefined} />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={country} onChange={(e: { target: { value: SetStateAction<string> } }) => setCountry(e.target.value)} placeholder="Enter your country" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={city} onChange={(e: { target: { value: SetStateAction<string> } }) => setCity(e.target.value)} placeholder="Enter your city" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" value={age} onChange={(e: { target: { value: SetStateAction<string> } }) => setAge(e.target.value)} placeholder="Enter your age" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-purpose">Search Purpose</Label>
              <Select value={searchPurpose} onValueChange={setSearchPurpose}>
                <SelectTrigger className="w-full">
                <SelectValue>
                    {searchPurpose ? searchPurpose : <span className="text-muted-foreground">Select search purpose</span>}
                  </SelectValue>
                </SelectTrigger>
                {/* <SelectContent>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="make-friends">Make Friends</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent> */}
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleRegister}>Register</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{username}</CardTitle>
                  <CardDescription>{bio}</CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Find a Match</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" children={undefined} />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" children={undefined} />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" children={undefined} />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={country} onChange={(e: { target: { value: SetStateAction<string> } }) => setCountry(e.target.value)} placeholder="Enter country" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(e: { target: { value: SetStateAction<string> } }) => setCity(e.target.value)} placeholder="Enter city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" value={age} onChange={(e: { target: { value: SetStateAction<string> } }) => setAge(e.target.value)} placeholder="Enter age" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="search-purpose">Search Purpose</Label>
                <Select value={searchPurpose} onValueChange={setSearchPurpose}>
                  <SelectTrigger className="w-full">
                  <SelectValue>
                    {searchPurpose ? searchPurpose : <span className="text-muted-foreground">Select search purpose</span>}
                  </SelectValue>
                  </SelectTrigger>
                  {/* <SelectContent> */}
                    {/* <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="make-friends">Make Friends</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="other">Other</SelectItem> */}
                  {/* </SelectContent> */}
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between">
                <Button onClick={startSearch} disabled={isSearching}>
                  Далее
                </Button>
                <Button onClick={stopSearch} variant="destructive" disabled={!isSearching}>
                  Стоп
                </Button>
              </div>
              {matchedUser && (
                <>
                  <Button onClick={handleVideoCall}>Video Call</Button>
                  <Button onClick={handleTextChat}>Text Chat</Button>
                </>
              )}
            </CardFooter>
          </Card>
          {notification && (
            <Card className="w-full max-w-md bg-red-100 text-red-800 p-4 rounded">
              {notification}
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
