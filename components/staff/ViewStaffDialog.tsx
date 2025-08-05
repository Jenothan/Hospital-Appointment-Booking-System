'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { StaffMember } from '@/contexts/StaffContext'
import { Mail, Phone, Building, Calendar, Shield, User } from 'lucide-react'

interface ViewStaffDialogProps {
  staff: StaffMember | null
  open: boolean
  onClose: () => void
}

export default function ViewStaffDialog({ staff, open, onClose }: ViewStaffDialogProps) {
  if (!staff) return null

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-5 w-5" />
            Staff Member Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <Avatar className="h-20 w-20">
              <AvatarImage src={staff.avatar} alt={staff.name} />
              <AvatarFallback className="text-lg">
                {getInitials(staff.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{staff.name}</h2>
              <p className="text-gray-600 text-lg">{staff.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={staff.isActive ? "default" : "secondary"}>
                  {staff.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{staff.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium">{staff.phone || '—'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">
                    {staff.role.toLowerCase().includes('doctor') || staff.role.toLowerCase().includes('surgeon') || staff.role.toLowerCase().includes('cardiologist') ? 'Specialization' : 'Department'}
                  </p>
                  <p className="font-medium">
                    {staff.role.toLowerCase().includes('doctor') || staff.role.toLowerCase().includes('surgeon') || staff.role.toLowerCase().includes('cardiologist') 
                      ? (staff.specialization || '—') 
                      : '—'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Last Login</p>
                  <p className="font-medium">
                    {staff.lastLogin
                      ? new Date(staff.lastLogin).toLocaleString()
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-600 font-medium">Account ID</p>
                <p className="text-sm text-slate-700">{staff.id}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}