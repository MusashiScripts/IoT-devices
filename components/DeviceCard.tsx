import type { Device } from '@/lib/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Clock, Power, Settings, Trash, Zap } from 'lucide-react'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { ScheduleDialog } from './ScheduleDialog'
import { Spinner } from './ui/spinner'
import { useDevice } from '@/hooks/useDevice'

interface DeviceCardProps {
  device: Device
  onToggle: (deviceId: string, value: boolean) => Promise<void>
  /* onSchedule: (deviceId: string, schedule: Device['schedule']) => void */
}

export function DeviceCard({ device, onToggle }: DeviceCardProps) {
  const { deviceSchedules, isLoading, isScheduleOpen, setIsScheduleOpen, getDeviceVariant, handleToggle, handleOpenChange, createHandleDeleteSchedule, addNewSchedule } = useDevice(device, onToggle)

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

      <CardContent className='space-y-4 flex-1'>
        <div className='flex justify-between items-center'>
          <span className='text-sm'>Estado:</span>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>{device.isOn ? 'Encendido' : 'Apagado'}</span>
            <Switch
              className='cursor-pointer'
              checked={device.isOn}
              disabled={device.status === 'offline' || isLoading}
              onCheckedChange={(value) => handleToggle(device.device_id, value)}
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

        {/* Renederizado de las programaciones */}
        {deviceSchedules && deviceSchedules.length > 0 ?
          deviceSchedules.map(schedule => (
            <div key={schedule.schedule_id} className='bg-blue-50 text-xs text-blue-700 px-2 py-0.5 rounded-md flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <Clock className='size-3' />
                <span>Programado: {schedule.action} a las {schedule.time}</span>
              </div>
              <Button variant='link' size='icon' className='cursor-pointer text-blue-700 p-0 hover:text-red-500 transition-colors'
                onClick={createHandleDeleteSchedule(schedule.schedule_id)} disabled={isLoading}>
                <Trash />
              </Button>
            </div>
          )) : (
            <div className='flex items-center justify-center'>
              <Badge className='bg-slate-700'>
                Sin programaciones
              </Badge>
            </div>
          )
        }

        {isLoading && <Spinner className='mx-auto w-full' />}

      </CardContent>

      <CardFooter>
        <Button variant='outline' size='sm' className='w-full flex items-center justify-center gap-2 cursor-pointer'
          disabled={device.status === 'offline' || isLoading}
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
        addNewSchedule={addNewSchedule}
      /* onSchedule={onSchedule} */
      />

    </Card >
  )
}