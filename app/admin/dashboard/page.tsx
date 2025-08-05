"use client"

import { useEffect, useState } from "react"
import { useAppointments } from "@/contexts/AppointmentContext"
import { useDoctorContext } from "@/contexts/DoctorContext"
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Line, Area, AreaChart
} from "recharts"
import { useRouter } from "next/navigation"
import {
  format, parseISO, isToday, isThisWeek, isThisMonth,
  subDays, startOfDay, eachDayOfInterval, subWeeks, 
  startOfWeek, eachWeekOfInterval, subMonths, 
  startOfMonth, eachMonthOfInterval, isValid
} from "date-fns"

export default function AdminDashboard() {
  const { appointments } = useAppointments()
  const { doctorss } = useDoctorContext()
  const router = useRouter()

  const [recent, setRecent] = useState(appointments.slice(-5).reverse())
  const [doctorStats, setDoctorStats] = useState<Record<string, number>>({})
  const [topDoctor, setTopDoctor] = useState("")
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [filteredAppointments, setFilteredAppointments] = useState(appointments)
  const [chartData, setChartData] = useState<Array<{date: string, appointments: number, label: string}>>([])
  const [totalInRange, setTotalInRange] = useState(0)

  useEffect(() => {
    setRecent([...appointments]
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
      .slice(0, 5)
    )

    const stats: Record<string, number> = {}
    appointments.forEach(a => {
      const d = a.doctor?.name
      if (d) stats[d] = (stats[d] || 0) + 1
    })
    setDoctorStats(stats)
    setTopDoctor(Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] || '')
  }, [appointments])

  useEffect(() => {
    const now = new Date()
    let intervals: Date[] = []
    let formatStr = ''
    
    if (range === 'daily') {
      // Last 7 days
      intervals = eachDayOfInterval({
        start: subDays(now, 6),
        end: now
      })
      formatStr = 'MMM dd'
    } else if (range === 'weekly') {
      // Last 8 weeks
      intervals = eachWeekOfInterval({
        start: subWeeks(now, 7),
        end: now
      }, { weekStartsOn: 1 })
      formatStr = 'MMM dd'
    } else {
      // Last 6 months
      intervals = eachMonthOfInterval({
        start: subMonths(now, 5),
        end: now
      })
      formatStr = 'MMM yyyy'
    }

    const data = intervals.map(interval => {
      const appointmentsInInterval = appointments.filter(a => {
        const appointmentDate = parseISO(a.date)
        
        if (range === 'daily') {
          return format(appointmentDate, 'yyyy-MM-dd') === format(interval, 'yyyy-MM-dd')
        } else if (range === 'weekly') {
          const weekStart = startOfWeek(interval, { weekStartsOn: 1 })
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekEnd.getDate() + 6)
          return appointmentDate >= weekStart && appointmentDate <= weekEnd
        } else {
          return format(appointmentDate, 'yyyy-MM') === format(interval, 'yyyy-MM')
        }
      })

      return {
        date: format(interval, 'yyyy-MM-dd'),
        appointments: appointmentsInInterval.length,
        label: format(interval, formatStr)
      }
    })

    setChartData(data)
    setTotalInRange(data.reduce((sum, item) => sum + item.appointments, 0))
    
    // Also update filtered appointments for the current period
    const filtered = appointments.filter(a => {
      const dt = parseISO(a.date)
      return range === 'daily' ? isToday(dt)
        : range === 'weekly' ? isThisWeek(dt)
          : isThisMonth(dt)
    })
    setFilteredAppointments(filtered)
  }, [appointments, range])


  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-10">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] animate-fadeIn">
          Admin Dashboard
        </h1>

        <p className="text-slate-600 text-sm">Smart control over your clinic's activity</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "📅", label: "Total Appointments", value: appointments.length, color: "text-blue-600" },
          { icon: "👨‍⚕️", label: "Active Doctors", value: doctorss.length, color: "text-green-600" },
          { icon: "🏆", label: "Top Doctor", value: topDoctor || "N/A", color: "text-purple-600" }
        ].map((item, idx) => (
          <Card key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-400 hover:scale-[1.01]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-slate-700 text-base font-semibold">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-sm text-slate-500 mt-1">Current stats</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Appointments */}
      <Card className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-700 text-lg">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              🕒
            </div>
            Recent Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length ? (
            <div className="bg-white">
              <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 text-slate-600 text-sm font-semibold">
                <span>Patient</span><span>Doctor</span><span>Date & Time</span><span>Status</span>
              </div>
              {recent.map((a, index) => (
                <div key={a.id || `${a.patientId}-${a.date}`} className={`grid grid-cols-4 gap-4 px-4 py-3 text-sm bg-white hover:bg-slate-50 transition-colors ${index !== recent.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <span className="font-medium text-slate-800">{a.patientName || 'Unknown'}</span>
                  <span className="text-slate-600">{a.doctor?.name || 'Unknown'}</span>
                  <span className="text-slate-600">
                    {a.date && isValid(new Date(a.date))
                      ? format(new Date(a.date), 'MMM dd, h:mm a')
                      : 'Unknown'}

                  </span>
                  <span>
                    <Badge variant={
                      a.status === 'confirmed' ? 'default' :
                        a.status === 'completed' ? 'secondary' :
                          'destructive'
                    } className="text-xs capitalize">
                      {a.status}
                    </Badge>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white">
              <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center">📋</div>
              <p>No recent appointments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Analytics Chart */}
      <Card className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-white">
          <div className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-700 text-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">📊</div>
            Appointment Booking Trends
          </CardTitle>
          <Tabs value={range} onValueChange={(val) => setRange(val as any)}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="daily">Last 7 Days</TabsTrigger>
              <TabsTrigger value="weekly">Last 8 Weeks</TabsTrigger>
              <TabsTrigger value="monthly">Last 6 Months</TabsTrigger>
            </TabsList>
          </Tabs>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Total: {totalInRange} appointments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">
                Avg: {chartData.length ? Math.round(totalInRange / chartData.length) : 0} per {range === 'daily' ? 'day' : range === 'weekly' ? 'week' : 'month'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="h-96 w-full bg-white mt-6">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="appointmentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    labelStyle={{ color: "#334155", fontWeight: "600" }}
                    formatter={(value: any) => [`${value} appointments`, 'Bookings']}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fill="url(#appointmentGradient)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-white">
                <div className="w-20 h-20 bg-slate-100 rounded-full mb-4 flex items-center justify-center text-2xl">📈</div>
                <p className="text-lg font-medium">No appointment data available</p>
                <p className="text-sm text-slate-400 mt-1">Data will appear once appointments are booked</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}