'use client'

import React, { useState } from 'react'
import { useDoctorContext } from '@/contexts/DoctorContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent,SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const timeOptions = Array.from({ length: 13 }, (_, i) => {
  const hour = 8 + i;
  return `${hour < 10 ? '0' : ''}${hour}:00`;
});

export default function DoctorSlotsPage() {
  const { doctorss, updateDoctor } = useDoctorContext()
  const { user } = useAuth()
  const [selectedWeekday, setSelectedWeekday] = useState('')
  const [timeInput, setTimeInput] = useState('')

  const doctor = doctorss.find((doc) => doc.id === user?.id)

  if (!doctor) {
    return (
      <div>
        User ID: {user?.id} <br />
        Doctor IDs: {doctorss.map(doc => doc.id).join(', ')}
      </div>
    )
  }

  const handleAddSlot = () => {
    if (!selectedWeekday || !timeInput) return

    const updatedSchedule = { ...doctor.availableSchedule }

    if (!updatedSchedule[selectedWeekday]) {
      updatedSchedule[selectedWeekday] = []
    }

    const isDuplicate = updatedSchedule[selectedWeekday].some((slot) => slot.time === timeInput)
    if (!isDuplicate) {
      updatedSchedule[selectedWeekday].push({ time: timeInput })
    }

    const updatedDoctor = { ...doctor, availableSchedule: updatedSchedule }
    updateDoctor(updatedDoctor)

    setTimeInput('')
    setSelectedWeekday('')
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className='pb-3'>
        <CardHeader>
          <CardTitle>My Weekly Slot Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ Display existing weekly schedule */}
          {Object.keys(doctor.availableSchedule).length === 0 ? (
            <p className="text-gray-500">No weekly slots scheduled yet.</p>
          ) : (
            Object.entries(doctor.availableSchedule)
              .sort(([a], [b]) => weekdays.indexOf(a) - weekdays.indexOf(b))
              .map(([day, slots]) => (
                <div key={day} className="mb-4">
                  <h2 className="text-lg font-semibold">{day}</h2>
                  <ul className="ml-4 list-disc">
                    {slots.map((slot, index) => (
                      <li key={index}>{slot.time}</li>
                    ))}
                  </ul>
                </div>
              ))
          )}

          {/* ✅ Add weekly slot form */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Select Weekday</label>
              <Select value={selectedWeekday} onValueChange={(val) => setSelectedWeekday(val)}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Select Weekday --" />
                </SelectTrigger>
                <SelectContent>
                {weekdays.map((day) => (
                    <SelectItem key={day} value={day}>
                    {day}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Time</label>
              <Select value={timeInput} onValueChange={(val) => setTimeInput(val)}>
                <SelectTrigger className="w-40">
                <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                {timeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                    {opt}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>

            <Button onClick={handleAddSlot}>Add Weekly Slot</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
