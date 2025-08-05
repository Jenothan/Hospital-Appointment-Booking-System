'use client';

import { useState } from 'react';
import { BookAppointmentForm } from '@/components/BookAppointmentForm';
import { UpcomingAppointment } from '@/components/UpcomingAppointment';
import { AppointmentHistory } from '@/components/AppointmentHistory';
import { NotificationBanner } from '@/components/NotificationBanner';
import { Calendar, Clock, History, Plus } from 'lucide-react';

export default function AppointmentsPage() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleBookingSuccess = (message: string) => {
    setNotification({ message, type: 'success' });
  };

  const handleBookingError = (message: string) => {
    setNotification({ message, type: 'error' });
  };

  const handleReschedule = (appointmentId: string) => {
    setNotification({ 
      message: 'Reschedule functionality would be implemented here', 
      type: 'info' 
    });
  };

  const handleCancel = (appointmentId: string) => {
    setNotification({ 
      message: 'Cancel functionality would be implemented here', 
      type: 'info' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
       <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Notification Banner */}
        {notification && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <NotificationBanner
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Appointment Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0 hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Book New Appointment</h2>
                    <p className="text-slate-200 text-sm">Schedule your next medical consultation</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <BookAppointmentForm
                  onBookingSuccess={handleBookingSuccess}
                  onBookingError={handleBookingError}
                />
              </div>
            </div>
          </div>

          {/* Upcoming Appointment Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0 hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Upcoming</h2>
                    <p className="text-slate-200 text-sm">Your next appointments</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <UpcomingAppointment
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                />
              </div>
            </div>

            {/* Quick Actions Card */}
            
          </div>
        </div>

        {/* Appointment History Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0 hover:shadow-2xl transition-all duration-300">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Appointment History</h2>
                <p className="text-slate-200 text-sm">View your past medical appointments and records</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <AppointmentHistory />
          </div>
        </div>
      </div>
    </div>
  );
}