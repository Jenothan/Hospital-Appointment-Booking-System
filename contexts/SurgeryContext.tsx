'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type SurgerySuggestion = {
  id: string // appointment id or unique id
  patientName: string
  patientphone: string
  patientage: string
  patientgender: string
  doctorName: string
  message: string
  submittedAt: string
  readByReceptionist: boolean
}

type SurgeryContextType = {
  surgeries: SurgerySuggestion[]
  addSurgery: (surgery: SurgerySuggestion) => void
  markAsRead: (id: string) => void
  deleteSurgery: (id: string) => void
  unreadCount: number
}

const SurgeryContext = createContext<SurgeryContextType | undefined>(undefined)

export const SurgeryProvider = ({ children }: { children: React.ReactNode }) => {
  const [surgeries, setSurgeries] = useState<SurgerySuggestion[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('surgeries')
    if (stored) setSurgeries(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('surgeries', JSON.stringify(surgeries))
  }, [surgeries])

  const addSurgery = (surgery: SurgerySuggestion) => {
    setSurgeries((prev) => [...prev, surgery])
  }

  const markAsRead = (id: string) => {
    setSurgeries((prev) =>
      prev.map((surg) =>
        surg.id === id ? { ...surg, readByReceptionist: true } : surg
      )
    )
  }

  const deleteSurgery = (id: string) => {
    setSurgeries((prev) => prev.filter((surg) => surg.id !== id)) // 👈 deletion logic
  }

  const unreadCount = surgeries.filter(s => !s.readByReceptionist).length // 👈 unread count

  return (
    <SurgeryContext.Provider value={{ surgeries, addSurgery, markAsRead, deleteSurgery, unreadCount }}>
      {children}
    </SurgeryContext.Provider>
  )
}


export const useSurgeryContext = () => {
  const context = useContext(SurgeryContext)
  if (!context) throw new Error('useSurgeryContext must be used within SurgeryProvider')
  return context
}
