import { useState } from 'react'
import { Button } from "/components/ui/button"
import { Input } from "/components/ui/input"
import { Label } from "/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "/components/ui/radio-group"

export default function FilterPanel() {
  const [filters, setFilters] = useState({
    gender: '',
    country: '',
    city: '',
    age: '',
    purpose: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }

  const applyFilters = () => {
    // Logic to apply filters
    console.log('Filters applied:', filters)
  }

  return (
    <div className="w-1/4 p-4 bg-gray-50 border-r border-gray-200">
      <div className="space-y-4">
        <div>
          <Label htmlFor="gender">Gender</Label>
          <RadioGroup defaultValue={filters.gender} onValueChange={(value) => handleChange({ target: { name: 'gender', value } })}>
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
          <Label htmlFor="country">Country</Label>
          <Select onValueChange={(value) => handleChange({ target: { name: 'country', value } })} value={filters.country}>
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
          <Label htmlFor="city">City</Label>
          <Input type="text" id="city" name="city" value={filters.city} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input type="number" id="age" name="age" value={filters.age} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="purpose">Search Purpose</Label>
          <Input type="text" id="purpose" name="purpose" value={filters.purpose} onChange={handleChange} />
        </div>
        <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
      </div>
    </div>
  )
}