// import { Department, Doctor, Appointment, AppointmentStatus } from '@/types/appointment';

// export const departments: Department[] = [
//   {
//     id: '1',
//     name: 'Cardiology',
//     doctors: [
//       {
//         id: '1',
//         name: 'Dr. Sarah Johnson',
//         hospital:'ce',
//         specialization: 'Cardiologist',
//         department: 'Cardiology',
//         availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
//       },
//       {
//         id: '2',
//         name: 'Dr. Michael Chen',
//         hospital:'ce',
//         specialization: 'Cardiac Surgeon',
//         department: 'Cardiology',
//         availableSlots: ['09:30', '10:30', '11:30', '14:30', '15:30']
//       }
//     ]
//   },
//   {
//     id: '2',
//     name: 'Neurology',
//     doctors: [
//       {
//         id: '3',
//         name: 'Dr. Emily Rodriguez',
//         hospital:'ce',
//         specialization: 'Neurologist',
//         department: 'Neurology',
//         availableSlots: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00']
//       },
//       {
//         id: '4',
//         name: 'Dr. David Kim',
//         hospital:'ce',
//         specialization: 'Neurosurgeon',
//         department: 'Neurology',
//         availableSlots: ['09:00', '10:00', '13:00', '14:00', '15:00']
//       }
//     ]
//   },
//   {
//     id: '3',
//     name: 'Orthopedics',
//     doctors: [
//       {
//         id: '5',
//         name: 'Dr. James Wilson',
//         hospital:'ce',
//         specialization: 'Orthopedic Surgeon',
//         department: 'Orthopedics',
//         availableSlots: ['08:30', '09:30', '10:30', '13:30', '14:30', '15:30']
//       }
//     ]
//   },
//   {
//     id: '4',
//     name: 'Dermatology',
//     doctors: [
//       {
//         id: '6',
//         name: 'Dr. Lisa Brown',
//         hospital:'ce',
//         specialization: 'Dermatologist',
//         availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00']
//       }
//     ]
//   }
// ];

// export const mockAppointments: Appointment[] = [
//   {
//     id: '1',
//     doctor: departments[0].doctors[0],
//     date: '2025-01-20',
//     time: '10:00',
//     type: 'in-person',
//     symptoms: 'Chest pain and shortness of breath',
//     status: 'scheduled',
//     location: 'Room 201, Cardiology Wing',
//     created_at: '2025-01-15T09:00:00Z'
//   },
//   {
//     id: '2',
//     doctor: departments[1].doctors[0],
//     date: '2025-01-10',
//     time: '14:00',
//     type: 'virtual',
//     symptoms: 'Persistent headaches',
//     status: 'completed',
//     consultation_link: 'https://hospital.zoom.us/j/123456789',
//     notes: 'Prescribed pain medication. Follow up in 2 weeks.',
//     created_at: '2025-01-05T11:30:00Z'
//   },
//   {
//     id: '3',
//     doctor: departments[2].doctors[0],
//     date: '2025-01-08',
//     time: '09:30',
//     type: 'in-person',
//     symptoms: 'Knee pain after injury',
//     status: 'completed',
//     location: 'Room 305, Orthopedics Wing',
//     notes: 'X-ray ordered. Physical therapy recommended.',
//     created_at: '2025-01-03T16:20:00Z'
//   },
//   {
//     id: '4',
//     doctor: departments[3].doctors[0],
//     date: '2025-01-05',
//     time: '11:00',
//     type: 'in-person',
//     symptoms: 'Skin rash and itching',
//     status: 'cancelled',
//     location: 'Room 108, Dermatology Wing',
//     created_at: '2024-12-30T10:15:00Z'
//   }
// ];