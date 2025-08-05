'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Video, User } from 'lucide-react';
import { format } from 'date-fns';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';

interface UpcomingAppointmentProps {
  onReschedule: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
}

export function UpcomingAppointment({ onReschedule, onCancel }: UpcomingAppointmentProps) {
  const { appointments } = useAppointments();
  const { user } = useAuth();

  // Get the next upcoming appointment for the logged-in user
  const upcomingAppointment = appointments
    .filter(apt => apt.patientId === user?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .find(apt => new Date(apt.date) >= new Date());

  if (!upcomingAppointment) {
    return (
      <Card className="w-full py-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Next Upcoming Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No upcoming appointments scheduled
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full py-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📅 Next Upcoming Appointment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-semibold">{upcomingAppointment.doctor.name}</p>
                  <p className="text-sm text-gray-600">{upcomingAppointment.doctor.specialization}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {format(new Date(upcomingAppointment.date), 'PPP')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{upcomingAppointment.time}</span>
              </div>

              <div className="flex items-center gap-2">
                {upcomingAppointment.type === 'in-person' ? (
                  <MapPin className="h-4 w-4 text-gray-500" />
                ) : (
                  <Video className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm">
                  {upcomingAppointment.type === 'in-person'
                    ? 'Hospital Visit'
                    : 'Video Consultation'}
                </span>
              </div>
            </div>

            <Badge variant={upcomingAppointment.type === 'in-person' ? 'default' : 'secondary'}>
              {upcomingAppointment.type === 'in-person' ? 'In-person' : 'Virtual'}
            </Badge>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Symptoms:</strong> {upcomingAppointment.symptoms}
            </p>

            <div className="flex gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => onReschedule(upcomingAppointment.id)}
              >
                Reschedule
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(upcomingAppointment.id)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
