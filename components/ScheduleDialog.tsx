import type { Device } from '@/lib/types'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { useState } from 'react'
import { Switch } from './ui/switch'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { daysOfWeek } from '@/lib/constants'

interface ScheduleDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  device: Device
  onSchedule: (deviceId: string, schedule: Device['schedule']) => void
}

export function ScheduleDialog({ open, onOpenChange, device, onSchedule }: ScheduleDialogProps) {
  const [enabled, setEnabled] = useState(device.schedule?.enabled || false)
  const [time, setTime] = useState(device.schedule?.time || '')
  const [action, setAction] = useState<'off' | 'on'>(device.schedule?.action || 'on')
  const [repeat, setRepeat] = useState<string[]>(device.schedule?.repeat || [])

  const handleDayToggle = (dayId: string, checked: boolean) => {
    if (checked) {
      setRepeat([...repeat, dayId])
    } else {
      setRepeat(repeat.filter(day => day !== dayId))
    }
  }

  const handleRemove = () => {
    onSchedule(device.id, undefined)
    onOpenChange(false)
  }

  const handleSave = () => {
    const schedule = enabled ? {
      enabled,
      time,
      action,
      repeat,
    } : undefined
    onSchedule(device.id, schedule)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Programar {device.name}</DialogTitle>
          <DialogDescription>
            Configura cuándo quieres que el dispositivo se encienda o apague automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
            <Label htmlFor="enabled">Activar programación</Label>
          </div>

          {enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Acción</Label>
                <Select value={action} onValueChange={(value: 'on' | 'off') => setAction(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Encender</SelectItem>
                    <SelectItem value="off">Apagar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Repetir los días</Label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeek.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={repeat.includes(day.id)}
                        onCheckedChange={(checked) => handleDayToggle(day.id, !!checked)}
                      />
                      <Label htmlFor={day.id} className="text-sm">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>


        <DialogFooter>
          <div>
            {device.schedule?.enabled && (
              <Button variant="destructive" onClick={handleRemove}>
                Eliminar programación
              </Button>
            )}
          </div>
          <div className='space-x-2'>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}