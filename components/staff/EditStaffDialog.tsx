'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { StaffMember, useStaff } from '@/contexts/StaffContext'
import { toast } from 'sonner'

interface EditStaffDialogProps {
  staff: StaffMember | null
  open: boolean
  onClose: () => void
}

export default function EditStaffDialog({ staff, open, onClose }: EditStaffDialogProps) {
  const { editStaff } = useStaff()
  const [formData, setFormData] = useState<Partial<StaffMember>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        role: staff.role,
        phone: staff.phone,
        specialization: staff.specialization,
        password: staff.password,
        isActive: staff.isActive,
        avatar: staff.avatar
      })
    }
  }, [staff])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staff) return

    setLoading(true)
    
    try {
      editStaff(staff.id, formData)
      toast.success('Staff member updated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to update staff member')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof StaffMember, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!staff) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role || ''}
                onChange={(e) => handleChange('role', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialization">
                {formData.role?.toLowerCase().includes('doctor') || formData.role?.toLowerCase().includes('surgeon') || formData.role?.toLowerCase().includes('cardiologist') ? 'Specialization' : 'Department'}
              </Label>
              <Input
                id="specialization"
                value={formData.specialization || ''}
                onChange={(e) => handleChange('specialization', e.target.value)}
                disabled={!formData.role?.toLowerCase().includes('doctor') && !formData.role?.toLowerCase().includes('surgeon') && !formData.role?.toLowerCase().includes('cardiologist')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
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
              value={formData.avatar || ''}
              onChange={(e) => handleChange('avatar', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive || false}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Active Status</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}