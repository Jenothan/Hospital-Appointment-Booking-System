'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StaffMember, useStaff } from '@/contexts/StaffContext'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface DeleteStaffDialogProps {
  staff: StaffMember | null
  open: boolean
  onClose: () => void
}

export default function DeleteStaffDialog({ staff, open, onClose }: DeleteStaffDialogProps) {
  
  const { deleteStaff } = useStaff()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!staff) return

    setLoading(true)
    
    try {
      await deleteStaff(staff.id)
      toast.success('Staff member deleted successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to delete staff member')
    } finally {
      setLoading(false)
    }
  }

  if (!staff) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Staff Member
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the staff member's account and all associated data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Staff Member:</strong> {staff.name}
            </p>
            <p className="text-sm text-red-800">
              <strong>Email:</strong> {staff.email}
            </p>
            <p className="text-sm text-red-800">
              <strong>Role:</strong> {staff.role}
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Staff Member'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}