'use client'

import { useAuth } from "@/contexts/AuthContext"
import { useAppointments } from "@/contexts/AppointmentContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Activity, Stethoscope, Heart, Users, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AppointmentData } from "@/contexts/AppointmentContext"

export default function PatientHomePage() {
  const { user } = useAuth()
  const { appointments } = useAppointments()
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!user) return null

  // Filter appointments for logged-in user
  const userAppointments = appointments.filter(
    (apt) => apt.patientId === user.id
  )

  // Upcoming confirmed appointments
  const upcomingAppointments = userAppointments
    .filter((apt) => new Date(apt.date) >= new Date() && apt.type && apt.time && apt.date)
    .slice(0, 2)

  // Recent activities - last 5 appointments sorted by date descending
  const recentActivities = userAppointments
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((apt) => ({
      type: "appointment",
      title: `Appointment with Dr. ${apt.doctor.name}`,
      date: apt.date,
      status: "confirmed",
      icon: Stethoscope,
    }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        {showWelcome && (
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            <div className="relative p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-slate-200 text-md">
                    Here's an overview of your healthcare activities and upcoming appointments.
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment: AppointmentData) => (
                      <div
                        key={appointment.id}
                        className="group relative overflow-hidden border-2 border-slate-100 rounded-xl p-6 hover:border-slate-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-slate-50"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-slate-100 rounded-full">
                                <Stethoscope className="w-6 h-6 text-slate-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-xl text-slate-800">{appointment.doctor.name}</h4>
                                <p className="text-slate-600 font-medium">{appointment.type}</p>
                              </div>
                            </div>
                            <Badge className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1">
                              Confirmed
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-slate-600">
                            <span className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                              <Calendar className="w-4 h-4" />
                              {new Date(appointment.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center gap-2 bg-slate-200 px-3 py-2 rounded-lg text-slate-700">
                              <Clock className="w-4 h-4" />
                              {appointment.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Link href="/patient/appointments">
                      <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                        View All Appointments
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-slate-500" />
                      </div>
                      <div className="absolute top-0 left-1/2 w-32 h-32 bg-slate-50 rounded-full -translate-x-1/2 -translate-y-4 -z-10"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No upcoming appointments</h3>
                    <p className="text-slate-500 mb-6">Schedule your next appointment to stay on top of your health</p>
                    <Link href="/patient/appointments">
                      <Button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                        <Plus className="w-5 h-5 mr-2" />
                        Book New Appointment
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
        

            {/* Health Tip Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-100 to-slate-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-300 rounded-full">
                    <Heart className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Health Tip</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Stay hydrated! Aim for 8 glasses of water daily to maintain optimal health and energy levels.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activities */}
        <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 p-4 border-2 border-slate-100 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-slate-50"
                  >
                    <div className="p-3 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
                      <activity.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{activity.title}</p>
                      <p className="text-sm text-slate-500">{new Date(activity.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1">
                      Confirmed
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Activity className="w-12 h-12 text-slate-500" />
                  </div>
                  <div className="absolute top-0 left-1/2 w-32 h-32 bg-slate-50 rounded-full -translate-x-1/2 -translate-y-4 -z-10"></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No recent activities</h3>
                <p className="text-slate-500">Your healthcare activities will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}