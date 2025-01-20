import { useState } from 'react'
import { Button } from "../components/ui/button"
import Input from "../components/ui/input"
import Label  from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { RadioGroup, RadioGroupItem } from "./src/components/ui/radio-group"
import React from 'react'

interface RegistrationFormProps {
  onRegister: () => void
}

export default function RegistrationForm({ onRegister }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    country: '',
    gender: '',
    age: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission (e.g., store data, redirect to video chat)
    console.log('Form submitted:', formData)
    onRegister()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select onValueChange={(value: any) => handleChange({ target: { name: 'country', value } })} value={formData.country}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usa">United States</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              {/* Add more countries as needed */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Gender</Label>
          <RadioGroup defaultValue={formData.gender} onValueChange={(value: any) => handleChange({ target: { name: 'gender', value } })}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full">Register</Button>
      </div>
    </form>
  )
}