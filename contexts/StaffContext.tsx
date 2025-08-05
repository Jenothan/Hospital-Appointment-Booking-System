'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  specialization?: string
  password: string
  lastLogin?: string
  isActive: boolean
  avatar?: string
}

interface StaffContextType {
  staffMembers: StaffMember[]
  doctors: StaffMember[]
  receptionists: StaffMember[]
  addStaff: (staff: StaffMember) => void
  editStaff: (id: string, updatedStaff: Partial<StaffMember>) => void
  deleteStaff: (id: string) => void
  getStaffById: (id: string) => StaffMember | undefined
}

const StaffContext = createContext<StaffContextType | undefined>(undefined)

export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])

  // Computed values for doctors and receptionists
  const doctors = staffMembers.filter(staff => staff.role.toLowerCase().includes('doctor') )
  const receptionists = staffMembers.filter(staff => staff.role.toLowerCase().includes('receptionist'))

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('staffMembers')
    if (saved) {
      setStaffMembers(JSON.parse(saved))
    } 
  }, [])

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem('staffMembers', JSON.stringify(staffMembers))
  }, [staffMembers])

  const addStaff = (newStaff: StaffMember) => {
    setStaffMembers((prev) => [...prev, newStaff])
  }

  const editStaff = (id: string, updatedStaff: Partial<StaffMember>) => {
    setStaffMembers((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, ...updatedStaff } : staff
      )
    )
  }

  const deleteStaff = (id: string) => {
    setStaffMembers((prev) => prev.filter((staff) => staff.id !== id))
  }

  const getStaffById = (id: string) => {
    return staffMembers.find((staff) => staff.id === id)
  }

  return (
    <StaffContext.Provider value={{ 
      staffMembers, 
      doctors,
      receptionists,
      addStaff, 
      editStaff, 
      deleteStaff, 
      getStaffById 
    }}>
      {children}
    </StaffContext.Provider>
  )
}

export const useStaff = () => {
  const context = useContext(StaffContext)
  if (!context) throw new Error('useStaff must be used within a StaffProvider')
  return context
}