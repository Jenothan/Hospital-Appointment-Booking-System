'use client'

import { useSurgeryContext } from '@/contexts/SurgeryContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SquareX } from 'lucide-react'
import { useState } from 'react'

export default function SurgeryMessagesPage() {
  const { surgeries, markAsRead } = useSurgeryContext()
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())

  const handleHide = (id: string) => {
    setHiddenIds(prev => new Set(prev).add(id))
  }

  // Filter visible surgeries (exclude hidden ones)
  const visibleSurgeries = surgeries.filter(s => !hiddenIds.has(s.id))

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Surgery Suggestions</h1>

      {visibleSurgeries.length === 0 && (
        <p className="text-gray-500">No surgery suggestions to display.</p>
      )}

      {visibleSurgeries.map((surgery) => (
        <Card key={surgery.id} className="hover:shadow-md transition-all pb-2">
          <CardHeader className='rounded-t-lg'>
            <CardTitle>
              Patient: {surgery.patientName}{' '}
              {surgery.readByReceptionist ? (
                <Badge variant="secondary">Read</Badge>
              ) : (
                <Badge variant="destructive">Unread</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-row justify-between items-center'>
              <div>
                <p><strong>Doctor:</strong> {surgery.doctorName}</p>
                <p><strong>Surgery Details:</strong> {surgery.message}</p>
                <p><strong>Patient Age:</strong> {surgery.patientage}</p>
                <p><strong>Phone:</strong> {surgery.patientphone}</p>
                <p><strong>Gender:</strong> {surgery.patientgender}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {new Date(surgery.submittedAt).toLocaleString()}
                </p>
                {!surgery.readByReceptionist && (
                  <button
                    className="mt-2 text-blue-600 underline"
                    onClick={() => markAsRead(surgery.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
              <div>
                <SquareX
                  className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleHide(surgery.id)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
