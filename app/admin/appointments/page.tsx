'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Search, Download, Calendar, Trash2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppointments } from '@/contexts/AppointmentContext'
import { useAuth } from '@/contexts/AuthContext'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


export default function AdminAppointments() {
  const { appointments, clearAppointments } = useAppointments()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)

  const userAppointments = appointments || []


  function handleDownloadPdf(appointmentId: string) {
  const data = localStorage.getItem(`appointment-report-${appointmentId}`)
  if (!data) {
    alert('No report found for this appointment.')
    return
  }

  const report = JSON.parse(data)
  const doc = new jsPDF()

  // NovaCare Hospital Branding
  doc.setTextColor(51, 65, 85)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('NovaCare Hospital', 105, 20, { align: 'center' })
  doc.setFontSize(12)
  doc.setTextColor(100)

  doc.setDrawColor(71, 85, 105)
  doc.line(20, 32, 190, 32)

  doc.setFontSize(16)
  doc.setTextColor(30, 41, 59)
  doc.text(' Patient Appointment Report', 20, 40)

  const fields = [
    ['Patient Name', report.patientName],
    ['Age', report.patientAge],
    ['Phone', report.patientPhone],
    ['Symptoms', report.symptoms],
    ['Diagnosis', report.diagnosis],
    ['Suggested Surgery', report.suggestSurgery ? 'Yes' : 'No'],
    ...(report.suggestSurgery && report.surgeryNote
      ? [['Surgery Note', report.surgeryNote]]
      : []),
    ['Doctor', report.doctorName],
    ['Submitted At', report.submittedAt],
  ]

  autoTable(doc, {
    startY: 48,
    head: [['Field', 'Details']],
    body: fields,
    theme: 'grid',
    styles: {
      halign: 'left',
      cellPadding: 4,
      fontSize: 11,
    },
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 20, right: 20 },
  })

  doc.save(`${report.patientName}-Appointment.pdf`)
}


  // Group appointments by doctor
  const doctorAppointmentsMap = userAppointments.reduce((acc, apt) => {
    const doctorId = apt.doctor?.id || 'unknown'
    if (!acc[doctorId]) {
      acc[doctorId] = {
        doctor: apt.doctor,
        department: apt.departmentId,
        appointments: [],
      }
    }
    acc[doctorId].appointments.push(apt)
    return acc
  }, {} as Record<string, { doctor: any; department: string; appointments: typeof userAppointments }>)

  // Filter by search
  const filteredDoctors = Object.entries(doctorAppointmentsMap).filter(
    ([_, { doctor, department }]) => {
      const searchText = searchTerm.toLowerCase()
      return (
        doctor?.name?.toLowerCase().includes(searchText) ||
        department?.toLowerCase().includes(searchText)
      )
    }
  )

  return (
    <Card className="w-full py-6 select-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 select-none">
          📋 Booking History
          {user?.role == 'admin' && (
          <Button variant="destructive" onClick={clearAppointments}>
            <Trash2 className="mr-1 h-4 w-4" />
            Delete All
          </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Filter */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by doctor name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Doctor Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {filteredDoctors.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-6">
                No doctors found matching your search.
              </p>
            ) : (
              filteredDoctors.map(([doctorId, { doctor, department }]) => (
                <Card
                  key={doctorId}
                  className="border shadow-sm rounded-lg overflow-hidden min-h-[320px]"
                >
                  {/* Image Banner */}
                  <img
                    src="https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA="
                    alt={doctor?.name}
                    className="w-full h-60 object-cover"
                  />

                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <h3 className="font-semibold text-lg">{doctor?.name || 'Unknown Doctor'}</h3>
                    <p className="text-sm text-muted-foreground">{department}</p>
                    <Button
                      className="mt-4"
                      onClick={() =>
                        setSelectedDoctorId(selectedDoctorId === doctorId ? null : doctorId)
                      }
                    >
                      {selectedDoctorId === doctorId ? 'Hide Appointments' : 'View Appointments'}
                    </Button>
                  </CardContent>
                </Card>



              ))
            )}
          </div>

          {/* Selected Doctor's Appointments */}
          {selectedDoctorId && (
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                Appointments for{' '}
                {
                  doctorAppointmentsMap[selectedDoctorId]?.doctor?.name ||
                  'Unknown Doctor'
                }
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Symptoms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctorAppointmentsMap[selectedDoctorId]?.appointments.map(
                    (apt) => (
                      <TableRow key={apt.id}>
                        <TableCell>
                          <p className="font-medium">{apt.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {apt.patientAge}, {apt.gender}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm">
                                {format(new Date(apt.date), 'MMM dd, yyyy')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(apt.time), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              apt.type === 'in-person' ? 'default' : 'secondary'
                            }
                          >
                            {apt.type === 'in-person' ? 'In-person' : 'Virtual'}
                          </Badge>
                        </TableCell>
                        <TableCell>{apt.symptoms}</TableCell>
                        <TableCell>{apt.status}</TableCell>
                        <TableCell className="text-right">
                          {apt.status === 'completed' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadPdf(apt.id)}
                                disabled={!localStorage.getItem(`appointment-report-${apt.id}`)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Report
                              </Button>

                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

