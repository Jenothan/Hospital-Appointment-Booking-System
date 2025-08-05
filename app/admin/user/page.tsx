'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Card, CardContent,
} from '@/components/ui/card'
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ManageUsersPage() {
  const { user, isLoading, deleteStaff } = useAuth()
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const filtered = allUsers.filter((u: any) =>
      ['admin', 'doctor', 'receptionist', 'patient'].includes(u.role)
    )
    setUsers(filtered)
  }, [])

  const handleDelete = async (id: string) => {
    if (id === user?.id) {
      toast.error("You can't delete yourself.")
      return
    }

    const confirmed = confirm("Are you sure you want to delete this user?")
    if (!confirmed) return

    const success = await deleteStaff(id)
    if (success) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success("User deleted successfully")
    } else {
      toast.error("Failed to delete user")
    }
  }

  if (isLoading) return <p className="p-4">Loading...</p>



  return (
    <Card className="max-w-6xl mx-auto mt-8 shadow-lg border">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Manage Users</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell className="capitalize">{u.role}</TableCell>
                <TableCell>{u.phone || '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
