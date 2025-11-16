import type { Device } from '@/lib/types'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { useEffect, useState } from 'react'
import { Switch } from './ui/switch'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { daysOfWeek } from '@/lib/constants'
import { createClient } from '@/utils/supabase/client'
import { Spinner } from './ui/spinner'

interface ScheduleDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  device: Device
  /* onSchedule: (deviceId: string, schedule: Device['schedule']) => void */
}

export function ScheduleDialog({ open, onOpenChange, device }: ScheduleDialogProps) {
  const [enabled, setEnabled] = useState(false)
  const [time, setTime] = useState<string | null>('')
  const [action, setAction] = useState('on')
  const [repeat, setRepeat] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const getDeviceSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select()
        .eq('device_id', device.device_id)

      if (error) {
        console.log(error)
      }

      if (data) {
        return data
      }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!device.device_id) return

    const fetchSchedule = async () => {
      const data = await getDeviceSchedule()

      if (!data || data.length === 0) return

      const schedule = data[0]
      setEnabled(schedule.enabled)
      setTime(schedule.time)
      setAction(schedule.action)


      const { data: schedules_x_days, error } = await supabase
        .from('schedules_x_days')
        .select(`
        week_days (
          day_name
        )
      `)
        .eq('schedule_id', schedule.schedule_id)

      if (error) {
        console.error(error)
      }

      if (schedules_x_days) {
        //console.log(schedules_x_days)
        //Aqui tiene q hacerse el seteo de repeat
        const repeatedDays = schedules_x_days.map(schedule => schedule.week_days.day_name)
        console.log(repeatedDays)

        setRepeat(repeatedDays)

      }

    }

    fetchSchedule()

  }, [device.device_id])



  const handleDayToggle = (dayId: string, checked: boolean) => {
    if (checked) {
      setRepeat([...repeat, dayId])
    } else {
      setRepeat(repeat.filter(day => day !== dayId))
    }
  }

  const handleRemove = () => {
    //onSchedule(device.id, undefined)
    onOpenChange(false)
  }

  const handleSave = () => {
    const schedule = enabled ? {
      enabled,
      time,
      action,
      repeat,
    } : undefined
    //onSchedule(device.id, schedule)
    onOpenChange(false)
  }

  //CHECK
  const handleScheduleToggle = async (value: boolean) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update({ enabled: value })
        .eq('device_id', device.device_id)
        .select()

      if (error) return

      if (data) {
        setEnabled(value)
      }

    } catch (error) {
      console.log('Algo fue mal', error)
    } finally {
      setIsLoading(false)
    }
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
              onCheckedChange={handleScheduleToggle}
              className='cursor-pointer'
              disabled={isLoading}
            />
            <Label htmlFor="enabled">Activar programación</Label>
            {isLoading && <Spinner />}
          </div>

          {enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  type="time"
                  value={time ? time : ''}
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
                        value={day.id}
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