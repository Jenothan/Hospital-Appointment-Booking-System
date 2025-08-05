'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Upload, X } from 'lucide-react'
import { format } from 'date-fns'
import { AppointmentData, useAppointments } from '@/contexts/AppointmentContext'
import { useDoctorContext } from '@/contexts/DoctorContext'
import { useAuth } from '@/contexts/AuthContext'
import { AppointmentType } from '@/types/appointment'
import { Doctor } from '@/contexts/DoctorContext'

interface BookAppointmentFormProps {
  onBookingSuccess: (message: string) => void
  onBookingError: (message: string) => void
}

export function BookAppointmentForm({
  onBookingSuccess,
  onBookingError,
}: BookAppointmentFormProps) {
  const { doctorss } = useDoctorContext()
  const { user } = useAuth()
  const { bookAppointment, getAvailableSlots, getQueueInfo, calculateActualAppointmentTime } = useAppointments()

  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('in-person')
  const [symptoms, setSymptoms] = useState<string>('')
  const [reports, setReports] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [patientName, setPatientName] = useState(user?.name || '')
  const [patientAge, setPatientAge] = useState('')
  const [patientMobile, setPatientMobile] = useState(user?.phone || '')
  const [gender, setPatientGender] = useState('')
  const [queueInfo, setQueueInfo] = useState<{
    queuedAppointments: AppointmentData[],
    queuePosition: number,
    waitingTime: number,
    actualTime: string,
    totalInQueue: number
  } | null>(null)

  const uniqueDepartments = Array.from(new Set(doctorss.map((doc) => doc.specialization)))

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
    setSelectedDoctor(null)
    setSelectedTime('')
    setSelectedDate(undefined)
    setAvailableDates([])
    setAvailableTimeSlots([])
  }

  const handleDoctorChange = (value: string) => {
    const doctor = doctorss.find((doc) => doc.id === value) || null
    setSelectedDoctor(doctor)
    setSelectedTime('')
    setSelectedDate(undefined)
    setAvailableTimeSlots([])
    
    if (doctor && doctor.id) {
      // Generate upcoming 14 days with matching availableSchedule weekdays
      const today = new Date()
      const upcomingDates: Date[] = []

      for (let i = 0; i < 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
        if (doctor.availableSchedule && doctor.availableSchedule[weekday]) {
          upcomingDates.push(date)
        }
      }

      setAvailableDates(upcomingDates)
    } else {
      setAvailableDates([])
    }
  }

  const handleDateChange = async (date: Date | undefined) => {
  setSelectedDate(date)
  setSelectedTime('')
  setAvailableTimeSlots([])

  if (!date || !selectedDoctor?.id || !selectedDoctor?.availableSchedule) return

  try {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
    const daySchedule = selectedDoctor.availableSchedule[weekday]
    if (!Array.isArray(daySchedule)) return

    // Only show base start times (e.g., 08:00, 16:00) from doctor schedule
    const baseSlots = daySchedule.map((slot) => slot.time).filter(Boolean)

    setAvailableTimeSlots(baseSlots)
  } catch (err) {
    console.error(err)
    setAvailableTimeSlots([])
  }
}

  const handleTimeSlotChange = async (value: string) => {
  setSelectedTime(value)
  if (selectedDoctor?.id && selectedDate && value) {
    try {
      const info = await getQueueInfo(selectedDoctor.id, selectedDate.toISOString(), value)
      setQueueInfo(info)
    } catch (error) {
      console.error('Queue info error:', error)
    }
  }
}

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).filter(
        (file) => file.type.includes('pdf') || file.type.includes('image')
      )
      setReports((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setReports((prev) => prev.filter((_, i) => i !== index))
  }

  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      (availableDate) => format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!selectedDoctor || !selectedDoctor.id || !selectedDate || !selectedTime || !symptoms.trim() || !patientName.trim() || 
  !patientAge.trim() || 
  !patientMobile.trim()) {
        onBookingError('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }
      if (!user) {
        onBookingError('You must be logged in to book an appointment')
        setIsSubmitting(false)
        return
      }

      // Create appointment time objects
      const appointmentDate = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const startTime = new Date(appointmentDate)
      startTime.setHours(hours, minutes, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + 10) // 10-minute appointment

      const appointmentData = {
        id: Date.now().toString(),
        patientId: user.id,
        patientName,
        patientAge,
        patientMobile,
        gender,
        doctor: {
          id: selectedDoctor.id,
          name: selectedDoctor.name,
          specialization: selectedDoctor.specialization,
          phone: selectedDoctor.phone,
        },
        departmentId: selectedDepartment,
        date: selectedDate.toISOString(),
        time: startTime.toISOString(),
        endTime: endTime.toISOString(),
        type: appointmentType,
        symptoms,
        reports,
        status: 'confirmed' as const,
        createdAt: new Date().toISOString(),
      };


      bookAppointment(appointmentData)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      onBookingSuccess(
        `Appointment booked with ${selectedDoctor.name} on ${format(selectedDate, 'PPP')} at ${selectedTime}`
      )

      // Reset form
      setSelectedDepartment('')
      setSelectedDoctor(null)
      setSelectedDate(undefined)
      setSelectedTime('')
      setAppointmentType('in-person')
      setSymptoms('')
      setReports([])
      setAvailableDates([])
      setAvailableTimeSlots([])
      setPatientName('')
      setPatientAge('')
      setPatientMobile('')
      setPatientGender('')
      setQueueInfo(null)

    } catch (error) {
      onBookingError('Failed to book appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto py-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📅 Book New Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="mb-2">Patient Name *</Label>
            <Input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
              required
            />
          </div>      

          <div>
            <Label className="mb-2">Age *</Label>
            <Input
              type="text"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              placeholder="Enter age"
              required
              min={1}
              max={3}
            />
          </div>

          <div>
            <Label className="mb-2">Mobile Number *</Label>
            <Input
              type="text"
              value={patientMobile}
              onChange={(e) => setPatientMobile(e.target.value)}
              placeholder="Enter phone number"
              required
              minLength={10}
              maxLength={10}
            />
          </div>
          
          <div>
            <Label className="mb-2">Gender *</Label>
            <RadioGroup
              value={gender}
              onValueChange={setPatientGender}
              className="flex gap-4"
            >
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
            <Label className="mb-2">Department / Specialization *</Label>
            <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {uniqueDepartments.map((dep) => (
                  <SelectItem key={dep} value={dep}>
                    {dep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDepartment && (
            <div>
              <Label className="mb-2">Select Doctor *</Label>
              <Select value={selectedDoctor?.id || ''} onValueChange={handleDoctorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctorss
                    .filter((doc) => doc.specialization === selectedDepartment)
                    .map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedDoctor && selectedDoctor.id && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Select Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      disabled={(date) => !isDateAvailable(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {selectedDate && (
                <div>
                  <Label className="mb-2">Select Appointment Start Time *</Label>
                  <Select value={selectedTime} onValueChange={handleTimeSlotChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-slots" disabled>No available slots</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {selectedTime && queueInfo && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                      <p className="text-sm text-amber-700">
                        🕐 Your appointment will start at: <strong>{queueInfo.actualTime}</strong>
                      </p>
                      <p className="text-sm text-amber-600">
                        🧑‍⚕️ {queueInfo.totalInQueue} patient(s) already booked at {selectedTime}.
                      </p>
                    </div>
                  )}
                </div>
              )}
              </div>
          )}

          <div>
            <Label className="text-base font-medium">Appointment Type *</Label>
            <RadioGroup
              value={appointmentType}
              onValueChange={(val) => setAppointmentType(val as AppointmentType)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person">In-person</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="virtual" />
                <Label htmlFor="virtual">Virtual/Video Consultation</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2">Symptoms / Reason for Visit *</Label>
            <Textarea
              placeholder="Please describe your symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Upload Reports (Optional)</Label>
            <div className="mt-2">
              <Input
                id="reports"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('reports')?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Reports
              </Button>
            </div>
            {reports.length > 0 && (
              <div className="mt-2 space-y-2">
                {reports.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}