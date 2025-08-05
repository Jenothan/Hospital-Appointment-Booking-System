// app/receptionist/slots/page.tsx
'use client'

import { useDoctorContext } from '@/contexts/DoctorContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ReceptionistSlotPage() {
  const { doctorss } = useDoctorContext()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctor Availability</h1>

      <Tabs defaultValue={doctorss[0]?.id || ''} className="space-y-4">
        <TabsList className="overflow-x-auto flex-nowrap">
          {doctorss.map((doc) => (
            <TabsTrigger key={doc.id} value={doc.id} className="whitespace-nowrap">
              {doc.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {doctorss.map((doc) => (
          <TabsContent key={doc.id} value={doc.id}>
            <Card className="mt-4 pb-3">
              <CardHeader>
                <CardTitle>
                  {doc.name} ({doc.specialization}) - {doc.phone}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(doc.availableSchedule).length === 0 ? (
                  <p>No schedule available</p>
                ) : (
                  <ScrollArea className="max-h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(doc.availableSchedule).map(([day, slots]) => (
                        <div key={day} className="border p-3 rounded-md shadow-sm">
                          <h3 className="font-semibold text-lg mb-2">{day}</h3>
                          {slots.length > 0 ? (
                            <ul className="list-disc pl-4 space-y-1">
                              {slots.map((slot, index) => (
                                <li key={index}>{slot.time}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No slots</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}