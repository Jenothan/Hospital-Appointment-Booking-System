'use client'

import { useSurgeryContext } from '@/contexts/SurgeryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function SurgerySuggestionsPage() {
  const { surgeries, markAsRead, deleteSurgery } = useSurgeryContext()

  const unreadSurgeries = surgeries.filter(s => !s.readByReceptionist)
  const readSurgeries = surgeries.filter(s => s.readByReceptionist)

  const allSurgeries = [...unreadSurgeries, ...readSurgeries]

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-primary">Surgery Suggestions</h2>

      {allSurgeries.length === 0 ? (
        <p className="text-muted-foreground">No surgery suggestions available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
  {allSurgeries.map((surgery) => (
    <Card
      key={surgery.id}
      className={`relative shadow-md rounded-xl border ${
        surgery.readByReceptionist ? 'border-gray-200' : 'border-blue-500'
      } hover:shadow-lg transition-all duration-300`}
    >
      {/* NEW badge (modern style) */}
      {!surgery.readByReceptionist && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulse">
          NEW
        </div>
      )}

      <CardHeader className="bg-gradient-to-r from-blue-50 to-white rounded-t-xl p-5">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {surgery.patientName} → {surgery.doctorName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-5 text-[15px] text-gray-700">
        <div>
          <p className="text-sm font-semibold text-gray-500">Doctor</p>
          <p><strong>👨‍⚕️ Name:</strong> {surgery.doctorName}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">Patient</p>
          <p><strong>• Name:</strong> {surgery.patientName}</p>
          <p><strong>• Age:</strong> {surgery.patientage}</p>
          <p><strong>• Gender:</strong> {surgery.patientgender}</p>
          <p><strong>• Phone:</strong> {surgery.patientphone}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">Diagnosis & Surgery</p>
          <p><strong>• Diagnosis:</strong> {surgery.message}</p>
          <p><strong>• Suggested At:</strong> {new Date(surgery.submittedAt).toLocaleString()}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          {!surgery.readByReceptionist && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAsRead(surgery.id)}
              className="border-blue-600 text-blue-600 hover:bg-blue-100 rounded-full px-4"
            >
              Mark as Read
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteSurgery(surgery.id)}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>


      )}
    </div>
  )
}
