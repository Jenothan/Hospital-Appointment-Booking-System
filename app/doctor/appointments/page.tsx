'use client'

import { useState } from 'react'
import { useAppointments } from '@/contexts/AppointmentContext'
import { useAuth } from '@/contexts/AuthContext'
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { useSurgeryContext } from '@/contexts/SurgeryContext'

export default function DoctorAppointmentsPage() {
  
  const { addSurgery } = useSurgeryContext()
  const { appointments, updateAppointment } = useAppointments()

  const { user } = useAuth()

  const [openSlot, setOpenSlot] = useState<string | null>(null)
  const [diagnoses, setDiagnoses] = useState<{ [id: string]: string }>({})
  const [surgerySuggestions, setSurgerySuggestions] = useState<{ [id: string]: boolean }>({})
  const [surgeryNotes, setSurgeryNotes] = useState<{ [id: string]: string }>({})

  if (!user?.name) {
    return <p className="p-6 text-red-600">Doctor not logged in</p>
  }

  const doctorAppointments = appointments.filter(
    (apt) => apt.doctor?.name === user.name && apt.status == 'confirmed'
  )

  // Group appointments by date, day, and time
  const grouped = doctorAppointments.reduce((acc, apt) => {
    const dateObj = new Date(apt.date)
    const date = dateObj.toLocaleDateString()
    const day = dateObj.toLocaleDateString(undefined, { weekday: 'long' })
    const time = new Date(apt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const key = `${date} (${day}) - ${time}`

    if (!acc[key]) acc[key] = []
    acc[key].push(apt)
    return acc
  }, {} as Record<string, typeof doctorAppointments>)

  const handleSubmitDiagnosis = (appointmentId: string) => {
    const diagnosis = diagnoses[appointmentId] || ''
    const suggestSurgery = !!surgerySuggestions[appointmentId]
    const surgeryNote = surgeryNotes[appointmentId] || ''

    if (!diagnosis.trim()) {
      toast.error('Please enter a diagnosis before submitting.')
      return
    }

    const submissionData = {
      appointmentId,
      diagnosis,
      suggestSurgery,
      surgeryNote,
      submittedBy: user.name,
      submittedAt: new Date().toISOString(),
    }

    // 🔄 Replace this console log with actual backend or context call
    console.log('Submitted Diagnosis:', submissionData)

    


    toast.success('Diagnosis submitted successfully.')

    const apt = doctorAppointments.find((a) => a.id === appointmentId)

    if (apt?.id) {
        updateAppointment(apt.id, {
          ...apt,
          status: 'completed',
        })
      }

      if (suggestSurgery && apt) {
        addSurgery({
          id: appointmentId,
          patientage: apt.patientAge,
          patientphone: apt.patientMobile,
          patientgender: apt.gender,
          doctorName: user.name,
          patientName: apt.patientName,
          message: surgeryNote,
          submittedAt: new Date().toISOString(),
          readByReceptionist: false,
        })
      }

      const reportData = {
        patientName: apt?.patientName,
        patientAge: apt?.patientAge,
        patientPhone: apt?.patientMobile,
        symptoms: apt?.symptoms,
        diagnosis,
        suggestSurgery,
        surgeryNote,
        doctorName: user.name,
        submittedAt: new Date().toLocaleString(),
      }

      localStorage.setItem(`appointment-report-${appointmentId}`, JSON.stringify(reportData))



    // Optional reset of form for that appointment
    setDiagnoses((prev) => ({ ...prev, [appointmentId]: '' }))
    setSurgerySuggestions((prev) => ({ ...prev, [appointmentId]: false }))
    setSurgeryNotes((prev) => ({ ...prev, [appointmentId]: '' }))
  }

  const handlePatientAbsent = (appointmentId: string) => {
  const apt = doctorAppointments.find((a) => a.id === appointmentId)
  if (!apt?.id) return

  updateAppointment(apt.id, {
    ...apt,
    status: 'cancelled',
  })

  toast.success('Marked as patient absent.')
}


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader className='bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 rounded-t-lg'>
          <CardTitle className='text-white'>Doctor's Appointment Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(grouped).length === 0 ? (
            <div className='p-4 text-center'>
              <p className="text-gray-500">No appointments found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Appointments Count</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(grouped).map(([slotKey, apts]) => (
                  <TableRow key={slotKey}>
                    <TableCell>{slotKey}</TableCell>
                    <TableCell>{apts.length}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setOpenSlot(openSlot === slotKey ? null : slotKey)
                        }
                      >
                        {openSlot === slotKey ? 'Close' : 'Open'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Expanded Appointments */}
      <div>
        {openSlot && grouped[openSlot] && (
          <div className="mt-6 space-y-6 w-full">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              Appointments for {openSlot}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grouped[openSlot].map((apt) => (
                <Card key={apt.id} className="pb-2">
                  <CardHeader className="bg-slate-500 rounded-t-lg">
                    <CardTitle className="text-white">Patient: {apt.patientName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Phone: {apt.patientMobile}</p>
                    <p>Age: {apt.patientAge}</p>
                    <p>Symptoms: {apt.symptoms}</p>

                    {/* Diagnosis */}
                    <div>
                      <label className="block font-medium text-sm text-slate-700 mb-1">
                        Diagnosis
                      </label>
                      <Textarea
                        value={diagnoses[apt.id] || ''}
                        onChange={(e) =>
                          setDiagnoses({ ...diagnoses, [apt.id]: e.target.value })
                        }
                        placeholder="Enter diagnosis details"
                      />
                    </div>

                    {/* Suggest Surgery */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={!!surgerySuggestions[apt.id]}
                        onCheckedChange={(val) =>
                          setSurgerySuggestions({
                            ...surgerySuggestions,
                            [apt.id]: !!val,
                          })
                        }
                        id={`surgery-${apt.id}`}
                      />
                      <label htmlFor={`surgery-${apt.id}`} className="text-sm">
                        Suggest surgery?
                      </label>
                    </div>

                    {/* Surgery Note */}
                    {surgerySuggestions[apt.id] && (
                      <div>
                        <label className="block font-medium text-sm text-slate-700 mb-1">
                          Message to Surgery Doctor
                        </label>
                        <Input
                          value={surgeryNotes[apt.id] || ''}
                          onChange={(e) =>
                            setSurgeryNotes({
                              ...surgeryNotes,
                              [apt.id]: e.target.value,
                            })
                          }
                          placeholder="e.g., Needs urgent orthopedic evaluation..."
                        />
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className='flex flex-row items-center justify-around'>
                    <Button
                      className="bg-slate-700 text-white hover:bg-slate-800"
                      onClick={() => handleSubmitDiagnosis(apt.id)}
                    >
                      Submit Diagnosis
                    </Button>
                    <Button
                    className='hover:bg-red-800 text-white'
                    variant={'destructive'}
                    onClick={() => handlePatientAbsent(apt.id)}
                    >
                      Patient Absent
                    </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
