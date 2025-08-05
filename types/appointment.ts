export type AppointmentType = 'in-person' | 'virtual';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'missed';

export interface Doctor {
  id: string;
  name: string;
  hospital: string;
  availableSlots: string[];
  specialization: string;
  department: string;
}

export interface Department {
  id: string;
  name: string;
  doctors: Doctor[];
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  type: AppointmentType;
  symptoms: string;
  status: AppointmentStatus;
  location?: string;
  consultation_link?: string;
  reports?: File[];
  notes?: string;
  created_at: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}