'use client'

import type { Device } from '@/lib/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Clock, Power, Settings, Zap } from 'lucide-react'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { useState } from 'react'
import { ScheduleDialog } from './ScheduleDialog'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface DeviceCardProps {
  device: Device
  /* onSchedule: (deviceId: string, schedule: Device['schedule']) => void */
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const router = useRouter()

  const supabase = createClient()


  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'luz':
        return <Zap className="h-5 w-5" />
      case 'aire acondicionado':
        return <Settings className="h-5 w-5" />
      default:
        return <Power className="h-5 w-5" />
    }
  }

  const getDeviceVariant = (status: string) => {
    return status === 'offline' ? 'outline' : 'default'
  }

  const handleOpenChange = (value: boolean) => {
    setIsScheduleOpen(value)
  }

  const handleDeviceToggle = async (deviceId: string) => {
    //Perfecto, solo falta q sea en tiempo real
    const now = new Date()
    const date = new Intl.DateTimeFormat('en-CA').format(now)
    console.log(date) // "2025-11-13"

    const { data, error } = await supabase
      .from('devices')
      .update({ isOn: !device.isOn, lastUpdated: date })
      .eq('device_id', deviceId)

    if (data) {
      console.log(data)
    }

    if (error) {
      console.log(error)
    }

    //Por ahora un refresh para q se vean los cambios pero mejor usar el real-time
    // con el metodo subscirbe al channel, el codigo esta justo debajo comentado

    router.refresh()

  }


  /* const devices = supabase.channel('custom-update-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'devices' },
      (payload) => {
        console.log('Change received!', payload)
      }
    )
    .subscribe() */

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            {getDeviceIcon(device.type)}
            <div >
              <CardTitle className='text-base'>{device.name}</CardTitle>
              <CardDescription>{device.type}</CardDescription>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className={`${device.status === 'offline' ? 'bg-red-500' : 'bg-green-500'} size-2 rounded-full`} />
            <Badge variant={getDeviceVariant(device.status)}>
              {device.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex justify-between items-center'>
          <span className='text-sm'>Estado:</span>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>{device.isOn ? 'Encendido' : 'Apagado'}</span>
            <Switch
              className='cursor-pointer'
              checked={device.isOn}
              disabled={device.status === 'offline'}
              onCheckedChange={() => handleDeviceToggle(device.device_id)}
            />
          </div>
        </div>

        <div className='text-xs text-muted-foreground space-y-1'>
          <div className='flex items-center justify-between'>
            <span>Ubicacion:</span>
            <span>{device.location}</span>
          </div>

          {device.powerConsumption && <div className='flex items-center justify-between'>
            <span>Consumo:</span>
            <span>{device.powerConsumption}</span>
          </div>}

          <div className='flex items-center justify-between'>
            <span>Actualizado:</span>
            <span>{device.lastUpdated}</span>
          </div>
        </div>

        {/* {device.schedule?.enabled && (
          <div className='bg-blue-50 text-xs text-blue-700 p-2 rounded flex items-center gap-1 '>
            <Clock className='size-3' />
            <span>Programado: {device.schedule.action} a las {device.schedule.time}</span>
          </div>
        )} */}
      </CardContent>

      <CardFooter>
        <Button variant='outline' size='sm' className='w-full flex items-center justify-center gap-2'
          disabled={device.status === 'offline'}
          onClick={() => setIsScheduleOpen(true)}
        >
          <Clock className='size-4 ' />
          Programar
        </Button>
      </CardFooter>

      <ScheduleDialog
        open={isScheduleOpen}
        onOpenChange={handleOpenChange}
        device={device}
      /* onSchedule={onSchedule} */
      />

    </Card>
  )
}