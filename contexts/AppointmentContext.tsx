'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed'
export type AppointmentType = 'in-person' | 'virtual'

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientAge: string
  patientMobile: string
  gender: string
  doctor: {
    id: string
    name: string
    specialization: string
    phone: string
  }
  departmentId: string
  date: string
  time: string
  endTime: string
  type: AppointmentType
  symptoms: string
  reports: File[]
  status: AppointmentStatus
  createdAt: string
}

// Keep AppointmentData as an alias for backward compatibility
export type AppointmentData = Appointment

interface AppointmentContextType {
  appointments: Appointment[]
  bookAppointment: (appointment: Appointment) => void
  cancelAppointment: (appointmentId: string) => void
  getAvailableSlots: (doctorId: string, date: string, baseSlots: string[]) => string[]
  calculateActualAppointmentTime: (doctorId: string, date: string, selectedTime: string) => { 
    actualTime: string, 
    queuePosition: number,
    waitingTime: number 
  }
  getQueueInfo: (doctorId: string, date: string, selectedTime: string) => {
    queuedAppointments: Appointment[],
    queuePosition: number,
    waitingTime: number,
    actualTime: string,
    totalInQueue: number
  }
  getBookedSlotsForTime: (doctorId: string, date: string) => string[]
  clearAppointments: () => void
  updateAppointment: (id: string, updated: Appointment) => void

}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

export const AppointmentProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const clearAppointments = () => {
  setAppointments([])
}

const updateAppointment = (id: string, updated: Appointment) => {
  setAppointments((prev) =>
    prev.map((apt) => (apt.id === id ? updated : apt))
  )
}



  // Load from localStorage on initial render
  useEffect(() => {
    const stored = localStorage.getItem('appointments')
    if (stored) {
      try {
        const parsedAppointments = JSON.parse(stored)
        setAppointments(parsedAppointments)
      } catch (err) {
        console.error('Error parsing appointments from localStorage:', err)
      }
    }
  }, [])

  // Save to localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments))
  }, [appointments])

  // Calculate actual appointment time based on queue
  const calculateActualAppointmentTime = (doctorId: string, date: string, selectedTime: string) => {
  try {
    if (!doctorId || !date || !selectedTime) {
      return { actualTime: selectedTime, queuePosition: 0, waitingTime: 0 }
    }

    const dateStr = new Date(date).toISOString().split('T')[0]

    const queuedAppointments = appointments.filter(apt => {
      const aptDateStr = new Date(apt.date).toISOString().split('T')[0]
      const aptTimeStr = new Date(apt.time).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
      return (
        apt.doctor.id === doctorId &&
        aptDateStr === dateStr &&
        aptTimeStr === selectedTime &&
        apt.status !== 'cancelled'
      )
    })

    const queuePosition = queuedAppointments.length
    const waitingTime = queuePosition * 10

    const [hours, minutes] = selectedTime.split(':').map(Number)
    const actualStartTime = new Date()
    actualStartTime.setHours(hours, minutes + waitingTime, 0, 0)

    const actualTime = actualStartTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })

    return { actualTime, queuePosition, waitingTime }
  } catch (error) {
    console.error('Error calculating appointment time:', error)
    return { actualTime: selectedTime, queuePosition: 0, waitingTime: 0 }
  }
}


  // Get detailed queue information
  const getQueueInfo = (doctorId: string, date: string, selectedTime: string) => {
    try {
      if (!doctorId || !date || !selectedTime) {
        return {
          queuedAppointments: [],
          queuePosition: 0,
          waitingTime: 0,
          actualTime: selectedTime,
          totalInQueue: 0
        }
      }

      const dateStr = new Date(date).toISOString().split('T')[0]
      
      const queuedAppointments = appointments.filter(apt => {
        if (!apt || !apt.doctor || !apt.doctor.id || !apt.date || !apt.time) {
          return false
        }
        
        try {
          const aptDateStr = new Date(apt.date).toISOString().split('T')[0]
          const aptTime = new Date(apt.time).toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          })
          
          return apt.doctor.id === doctorId && 
                 aptDateStr === dateStr && 
                 aptTime === selectedTime &&
                 apt.status !== 'cancelled'
        } catch (error) {
          console.error('Error parsing appointment time:', error)
          return false
        }
      })

      const queuePosition = queuedAppointments.length
      const waitingTime = queuePosition * 10
      const totalInQueue = queuedAppointments.length
      
      // Calculate actual start time
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const actualStartTime = new Date()
      actualStartTime.setHours(hours, minutes + waitingTime, 0, 0)
      
      const actualTime = actualStartTime.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })

      return {
        queuedAppointments,
        queuePosition,
        waitingTime,
        actualTime,
        totalInQueue
      }
    } catch (error) {
      console.error('Error getting queue info:', error)
      return {
        queuedAppointments: [],
        queuePosition: 0,
        waitingTime: 0,
        actualTime: selectedTime,
        totalInQueue: 0
      }
    }
  }

  const bookAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment])
  }

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
      )
    )
  }

  const getBookedSlotsForTime = (doctorId: string, date: string): string[] => {
    if (!doctorId || !date) {
      return []
    }

    try {
      const targetDate = new Date(date).toDateString()
      
      return appointments
        .filter(apt => {
          // Safety checks to prevent undefined errors
          if (!apt || !apt.doctor || !apt.doctor.id || !apt.time || apt.status === 'cancelled') {
            return false
          }
          
          try {
            const aptDate = new Date(apt.time).toDateString()
            return apt.doctor.id === doctorId && aptDate === targetDate
          } catch (error) {
            console.error('Error parsing appointment time:', error)
            return false
          }
        })
        .map(apt => {
          try {
            const time = new Date(apt.time)
            return time.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          } catch (error) {
            console.error('Error formatting appointment time:', error)
            return ''
          }
        })
        .filter(Boolean) // Remove empty strings
    } catch (error) {
      console.error('Error in getBookedSlotsForTime:', error)
      return []
    }
  }

  const getAvailableSlots = (doctorId: string, date: string, baseSlots: string[]): string[] => {
    // Safety checks to prevent undefined errors
    if (!doctorId || !date || !Array.isArray(baseSlots)) {
      console.warn('Invalid parameters passed to getAvailableSlots:', { doctorId, date, baseSlots })
      return []
    }

    try {
      const bookedSlots = getBookedSlotsForTime(doctorId, date)
      
      // Filter out booked slots from base slots
      const availableSlots = baseSlots.filter(slot => {
        if (!slot) return false
        return !bookedSlots.includes(slot)
      })

      return availableSlots
    } catch (error) {
      console.error('Error in getAvailableSlots:', error)
      return baseSlots || [] // Return base slots as fallback
    }
  }

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        bookAppointment,
        cancelAppointment,
        getAvailableSlots,
        calculateActualAppointmentTime,
        getQueueInfo,
        getBookedSlotsForTime,
        clearAppointments,
        updateAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  )
}

export const useAppointments = () => {
  const context = useContext(AppointmentContext)
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentProvider')
  }
  return context
}
