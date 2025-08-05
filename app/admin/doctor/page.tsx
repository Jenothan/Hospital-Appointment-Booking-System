'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, PlusIcon, Trash } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useStaff } from '@/contexts/StaffContext'
import { Doctor, TimeSlot, useDoctorContext } from '@/contexts/DoctorContext'

const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
] as const

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const timeOptions = Array.from({ length: 13 }, (_, i) => {
  const hour = 8 + i
  return `${hour < 10 ? '0' : ''}${hour}:00`
})

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

export default function DoctorPage() {
  const { deleteDoctor } = useDoctorContext()
  const { doctors } = useStaff()
  const { doctorss, addDoctor } = useDoctorContext()

  const [formData, setFormData] = useState({ name: '', specialization: '', phone: '' })
  const [daySlots, setDaySlots] = useState<{ day: string; times: string[] }[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectDoctor, setSelectDoctor] = useState('')

  const handleToggleDay = (day: string) => {
    setDaySlots((prev) =>
      prev.find((ds) => ds.day === day)
        ? prev.filter((ds) => ds.day !== day)
        : [...prev, { day, times: [''] }]
    )
  }

  const handleTimeChange = (day: string, index: number, value: string) => {
    setDaySlots((prev) =>
      prev.map((ds) =>
        ds.day === day ? { ...ds, times: ds.times.map((t, i) => (i === index ? value : t)) } : ds
      )
    )
  }

  const handleAddTime = (day: string) => {
    setDaySlots((prev) =>
      prev.map((ds) => (ds.day === day ? { ...ds, times: [...ds.times, ''] } : ds))
    )
  }

  const handleRemoveTime = (day: string, index: number) => {
    setDaySlots((prev) =>
      prev.map((ds) =>
        ds.day === day ? { ...ds, times: ds.times.filter((_, i) => i !== index) } : ds
      )
    )
  }

  const handleAddDoctor = () => {
    if (!formData.name || !formData.phone) return

    const availableSchedule: { [key: string]: { time: string }[] } = {}
    daySlots.forEach(({ day, times }) => {
      availableSchedule[day] = times.filter(Boolean).map((time) => ({ time }))
    })

    const selected = doctors.find(
      (doc) => doc.name === formData.name && doc.phone === formData.phone
    )

    addDoctor({
      id: selected ? selected.id : generateId(),
      name: formData.name,
      specialization: formData.specialization,
      phone: formData.phone,
      availableSchedule,
    })

    setFormData({ name: '', specialization: '', phone: '' })
    setDaySlots([])
    setSelectDoctor('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">👨‍⚕️ Doctor Management</h1>

      {/* Doctor Form */}
      <Card className="bg-white rounded-xl shadow-lg mx-auto mb-10 w-full">
        <CardHeader className="bg-slate-700 rounded-t-xl px-6 py-4">
          <CardTitle className="text-white text-lg">Add New Doctor</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              
              onValueChange={(value) => {
                setSelectDoctor(value)
                const selected = doctors.find((doc) => doc.name === value)
                if (selected) {
                  setFormData({
                    name: selected.name ?? '',
                    phone: selected.phone ?? '',
                    specialization: selected.specialization ?? '',
                  })
                }
              }}
            >
              <SelectTrigger className='w-100'>
                <SelectValue placeholder="Select Existing Doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc.email} value={doc.name}>
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Select
              value={formData.specialization}
              onValueChange={(val) => setFormData({ ...formData, specialization: val })}
            >
              <SelectTrigger className='w-100'>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALIZATIONS.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="border border-slate-200 rounded-lg p-4">
            <legend className="font-semibold text-slate-700 px-2">Available Days & Time Slots</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {daysOfWeek.map((day) => {
                const selected = daySlots.find((ds) => ds.day === day)
                return (
                  <div key={day}>
                    <label className="flex items-center gap-2 font-medium text-slate-700">
                      <Checkbox
                        checked={!!selected}
                        onCheckedChange={() => handleToggleDay(day)}
                      />
                      {day}
                    </label>
                    {selected && (
                      <div className="mt-2 space-y-2">
                        {selected.times.map((time, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Select
                              value={time}
                              onValueChange={(val) => handleTimeChange(day, idx, val)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveTime(day, idx)}
                            >
                              <Trash className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTime(day)}
                          className="text-slate-600"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Time
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </fieldset>

          <Button
            onClick={handleAddDoctor}
            className="bg-slate-600 hover:bg-blue-700 text-white w-fit px-6 py-2 rounded-lg"
          >
            <PlusIcon/> Add Doctor
          </Button>
        </CardContent>
      </Card>

      {/* Doctor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctorss.map((doc) => (
          <Card key={doc.id} className="bg-white shadow-lg rounded-xl">
            <CardHeader className="bg-slate-700 rounded-t-xl px-4 py-3">
              <CardTitle className="text-white">Dr. {doc.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1"><strong>📞 Phone:</strong> {doc.phone}</p>
              <p className="text-sm text-slate-600 mb-3"><strong>🏥 Specialization:</strong> {doc.specialization}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" onClick={() => setSelectedDoctor(doc)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Doctor Details</DialogTitle>
                  </DialogHeader>
                  {selectedDoctor && (
                    <div className="space-y-3 py-3">
                      <p><strong>Name:</strong> Dr. {selectedDoctor.name}</p>
                      <p><strong>Phone:</strong> {selectedDoctor.phone}</p>
                      <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                      <p><strong>ID:</strong> {selectedDoctor.id}</p>
                      <div>
                        <strong>Schedule:</strong>
                        <div className="space-y-2 mt-2">
                          {Object.entries(selectedDoctor.availableSchedule).map(([day, slots]) => (
                            <div key={day}>
                              <p className="font-medium">{day}:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {slots.map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                  >
                                    {s.time}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          const confirmDelete = confirm(`Delete Dr. ${doc.name}?`)
                          if (!confirmDelete) return

                          try {
                            await deleteDoctor(doc.id)
                            toast.success('Doctor deleted')
                          } catch (err) {
                            console.error(err)
                            toast.error('Failed to delete')
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
