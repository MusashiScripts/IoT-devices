import type { Device } from '@/lib/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Clock, Power, Settings, Zap } from 'lucide-react'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { useState } from 'react'
import { ScheduleDialog } from './ScheduleDialog'

interface DeviceCardProps {
  device: Device
  onToggle: (deviceId: string) => void
  onSchedule: (deviceId: string, schedule: Device['schedule']) => void
}

export function DeviceCard({ device, onToggle, onSchedule }: DeviceCardProps) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)

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
              checked={device.isOn}
              disabled={device.status === 'offline'}
              onCheckedChange={() => onToggle(device.id)}
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

        {device.schedule?.enabled && (
          <div className='bg-blue-50 text-xs text-blue-700 p-2 rounded flex items-center gap-1 '>
            <Clock className='size-3' />
            <span>Programado: {device.schedule.action} a las {device.schedule.time}</span>
          </div>
        )}
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
        onSchedule={onSchedule}
      />

    </Card>
  )
}