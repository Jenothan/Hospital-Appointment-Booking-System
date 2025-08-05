'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useStaff, StaffMember } from '@/contexts/StaffContext'
import ViewStaffDialog from '@/components/staff/ViewStaffDialog'
import EditStaffDialog from '@/components/staff/EditStaffDialog'
import DeleteStaffDialog from '@/components/staff/DeleteStaffDialog'
import AddStaffDialog from '@/components/staff/AddStaffDialog'
import { UserPlus, Eye, Edit, Trash2, Users, Stethoscope, UserCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function StaffPage() {
  
  const { staffMembers, doctors, receptionists } = useStaff()
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const sortedDoctors = useMemo(() => {
    return [...doctors].sort((a, b) => {
      const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0
      const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0
      return dateB - dateA
    })
  }, [doctors])

  const sortedReceptionists = useMemo(() => {
    return [...receptionists].sort((a, b) => {
      const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0
      const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0
      return dateB - dateA
    })
  }, [receptionists])

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleView = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setViewDialogOpen(true)
  }

  const handleEdit = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setEditDialogOpen(true)
  }

  const handleDelete = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setDeleteDialogOpen(true)
  }

  const closeDialogs = () => {
    setViewDialogOpen(false)
    setEditDialogOpen(false)
    setDeleteDialogOpen(false)
    setAddDialogOpen(false)
    setSelectedStaff(null)
  }

  const activeStaffCount = staffMembers.filter(staff => staff.isActive).length
  const totalStaffCount = staffMembers.length

  const renderStaffTable = (staffList: StaffMember[], type: 'doctor' | 'receptionist') => (
    <div className="bg-white rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff ID</TableHead>
            <TableHead>Role</TableHead>
            {type === 'doctor' && <TableHead>Specialization</TableHead>}
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffList.length ? (
            staffList.map((staff) => (
              <TableRow key={staff.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                      <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{staff.id}</p>
                      <p className="font-medium text-slate-900">{staff.name}</p>
                      <p className="text-sm text-slate-500">{staff.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{staff.role}</Badge>
                </TableCell>
                {type === 'doctor' && (
                  <TableCell className="text-slate-600">
                    {staff.specialization || '—'}
                  </TableCell>
                )}
                <TableCell className="text-slate-600">
                  {staff.phone || '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={staff.isActive ? "default" : "secondary"}>
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleView(staff)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(staff)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(staff)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={type === 'doctor' ? 7 : 6} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  {type === 'doctor' ? (
                    <Stethoscope className="h-12 w-12 text-slate-400" />
                  ) : (
                    <UserCheck className="h-12 w-12 text-slate-400" />
                  )}
                  <p className="text-slate-500 text-lg">No {type}s found</p>
                  <p className="text-slate-400 text-sm">Add your first {type} to get started</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-slate-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
            <p className="text-slate-600">
              {doctors.length} doctors, {receptionists.length} receptionists ({activeStaffCount} active)
            </p>
          </div>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <Tabs defaultValue="doctors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Doctors ({doctors.length})
          </TabsTrigger>
          <TabsTrigger value="receptionists" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Receptionists ({receptionists.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="doctors">
          {renderStaffTable(sortedDoctors, 'doctor')}
        </TabsContent>
        
        <TabsContent value="receptionists">
          {renderStaffTable(sortedReceptionists, 'receptionist')}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ViewStaffDialog
        staff={selectedStaff}
        open={viewDialogOpen}
        onClose={closeDialogs}
      />
      <EditStaffDialog
        staff={selectedStaff}
        open={editDialogOpen}
        onClose={closeDialogs}
      />
      <DeleteStaffDialog
        staff={selectedStaff}
        open={deleteDialogOpen}
        onClose={closeDialogs}
      />
      <AddStaffDialog
        open={addDialogOpen}
        onClose={closeDialogs}
      />
    </div>
  )
}