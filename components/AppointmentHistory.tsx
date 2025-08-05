'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useAppointments } from "@/contexts/AppointmentContext"
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled';

export function AppointmentHistory() {
  const { appointments } = useAppointments();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Use all appointments since we don't have auth context
const { user } = useAuth(); // assumes user object has an id
const userAppointments = appointments.filter(apt => apt.patientId === user?.id);


function handleDownloadPdf(appointmentId: string) {
  const data = localStorage.getItem(`appointment-report-${appointmentId}`)
  if (!data) {
    alert('No report found for this appointment.')
    return
  }

  const report = JSON.parse(data)
  const doc = new jsPDF()

  // 🏥 NovaCare Hospital Branding
  doc.setTextColor(51, 65, 85) // slate-700
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('NovaCare Hospital', 105, 20, { align: 'center' })

  doc.setFontSize(12)
  doc.setTextColor(100)
  doc.text('Committed to Compassionate Care', 105, 27, { align: 'center' })

  // 🧾 Section Title
  doc.setDrawColor(71, 85, 105) // slate-600
  doc.line(20, 32, 190, 32)

  doc.setFontSize(16)
  doc.setTextColor(30, 41, 59) // slate-800
  doc.text('🩺 Patient Appointment Report', 20, 40)

  // 📋 Report Table
  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.setFont('helvetica', 'normal')

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
      fillColor: [51, 65, 85], // slate-700
      textColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    margin: { left: 20, right: 20 },
  })

  doc.save(`${report.patientName}-Appointment.pdf`)
}



  // Get unique departments from userAppointments for filter dropdown  
  const departments = Array.from(new Set(userAppointments.map(apt => apt.departmentId)));

  const filteredAppointments = userAppointments.filter(appointment => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      appointment.doctor.name.toLowerCase().includes(searchText) ||
      appointment.departmentId.toLowerCase().includes(searchText) ||
      appointment.symptoms.toLowerCase().includes(searchText);

    const matchesDepartment = departmentFilter === 'all' || appointment.departmentId === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <Card className="w-full py-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📋 Booking History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by doctor name, department, or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Removed status filter */}

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Appointments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor & Department</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  {/* Removed Status Column */}
                  <TableHead>Symptoms</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No appointments found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.doctor.name}</p>
                          <p className="text-sm text-gray-600">{appointment.departmentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm">{format(new Date(appointment.date), 'MMM dd, yyyy')}</p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={appointment.type === 'in-person' ? 'default' : 'secondary'}>
                          {appointment.type === 'in-person' ? 'In-person' : 'Virtual'}
                        </Badge>
                      </TableCell>
                      {/* Removed status cell */}
                      <TableCell>
                        <p className="text-sm line-clamp-2">{appointment.symptoms}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        {/* Since status removed, you may want to remove this condition or keep if needed */}
                        {appointment.status === 'completed' && (
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPdf(appointment.id)}
                              disabled={!localStorage.getItem(`appointment-report-${appointment.id}`)} // Disable if no report
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Report
                            </Button>

                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600">
            Showing {filteredAppointments.length} of {userAppointments.length} appointments
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
