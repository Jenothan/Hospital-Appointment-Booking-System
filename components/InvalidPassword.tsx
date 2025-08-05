'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from './ui/button'

export default function InvalidPassword() {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>

      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Login Failed</DialogTitle>
            <DialogDescription>
              Invalid email or password. Please try again.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
        <Button onClick={handleClose}>
            Ok
        </Button>
      </Dialog>
    </>
  )
}
