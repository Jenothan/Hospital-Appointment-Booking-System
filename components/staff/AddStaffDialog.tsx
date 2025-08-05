'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StaffMember, useStaff } from '@/contexts/StaffContext'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

interface AddStaffDialogProps {
  open: boolean
  onClose: () => void
}

export default function AddStaffDialog({ open, onClose }: AddStaffDialogProps) {
  const { addStaff } = useStaff()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    specialization: '',
    password: '',
    isActive: true,
    avatar: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)


  const { name, email, role, phone, password } = formData
  if (!name || !email || !role || !phone || !password) {
      alert('Please fill in all required fields')
    setLoading(false)
    return
  }

  try {
    const newStaff: StaffMember = {
      id: uuidv4(),
      ...formData,
      lastLogin: undefined
    }

    // 1. Add staff to context/local storage
    addStaff(newStaff)

    // 2. 🔐 Save credentials for login
    const credentials = JSON.parse(localStorage.getItem('credentials') || '[]')
    credentials.push({
      id: newStaff.id,
      email: newStaff.email,
      password: newStaff.password,
    })
    localStorage.setItem('credentials', JSON.stringify(credentials))

    // 3. 👤 Save user info for profile/context
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    users.push({
      id: newStaff.id,
      name: newStaff.name,
      username: newStaff.email.split('@')[0],
      email: newStaff.email,
      role: newStaff.role.toLowerCase(),
      profileImage: newStaff.avatar || '',
      phone: newStaff.phone,
    })
    localStorage.setItem('users', JSON.stringify(users))

    // 4. Clear form & show success
    toast.success('Staff member added successfully')
    setFormData({
      name: '',
      email: '',
      role: '',
      phone: '',
      specialization: '',
      password: '',
      isActive: true,
      avatar: ''
    })
    onClose()
  } catch (error) {
    toast.error('Failed to add staff member')
  } finally {
    setLoading(false)
  }
}



  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            
            <Select
                value={formData.role || ""}
                onValueChange={(value) => handleChange('role', value)}
                >
                <SelectTrigger id="role">
                    <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                </SelectContent>
            </Select>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
            <Label htmlFor="specialization">Specialization *</Label>
                    <Select
                        value={formData.specialization}
                        onValueChange={(value) => handleChange('specialization', value)}
                        disabled={!formData.role.toLowerCase().includes('doctor')}
                    >
                        <SelectTrigger id="specialization">
                        <SelectValue placeholder="Select Specialization" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                        </SelectContent>
                    </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              type="url"
              value={formData.avatar}
              onChange={(e) => handleChange('avatar', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Active Status</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Staff Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}