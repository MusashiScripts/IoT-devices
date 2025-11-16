'use client'

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
  /* onSchedule: (deviceId: string, schedule: Device['schedule']) => void */
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { deviceStatus, deviceSchedules, isLoading, isScheduleOpen, setIsScheduleOpen, getDeviceVariant, handleDeviceToggle, handleOpenChange, createHandleDeleteSchedule } = useDevice(device)
  /* const [deviceStatus, setDeviceStatus] = useState(device.isOn)
  const [deviceSchedules, setDeviceSchedules] = useState<Schedule[]>()
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const fetchSchedule = async () => {
      const schedule = await getDeviceSchedule(device.device_id)
      setDeviceSchedules(schedule)
    }

    fetchSchedule()

  }, [device.device_id])
 */

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

  /* const getDeviceVariant = (status: string) => {
    return status === 'offline' ? 'outline' : 'default'
  }

  const handleOpenChange = (value: boolean) => {
    setIsScheduleOpen(value)
  }

  const handleDeviceToggle = async (deviceId: string, value: boolean) => {
    //Perfecto, solo falta q sea en tiempo real
    setIsLoading(true)
    try {
      const now = new Date()
      const date = new Intl.DateTimeFormat('en-CA').format(now)
      console.log(date) // "2025-11-13"

      const { data, error } = await supabase
        .from('devices')
        .update({ isOn: !device.isOn, lastUpdated: date })
        .eq('device_id', deviceId)

      if (data) {
        console.log(data)
        //setDeviceStatus(value)
      }

      if (error) {
        console.log(error)
      }
    } catch (error) {
      console.log('error, algo fue mal', error)
    } finally {
      setIsLoading(false)
      setDeviceStatus(value)
    }


    //Por ahora un refresh para q se vean los cambios pero mejor usar el real-time
    // con el metodo subscirbe al channel, el codigo esta justo debajo comentado

    router.refresh()

  }

  const createHandleDeleteSchedule = (scheduelId: string) => async () => {
    setIsLoading(true)
    try {
      await deleteScheduleById(scheduelId)
      const newDeviceSchedules = deviceSchedules?.filter(schedule => schedule.schedule_id !== scheduelId)
      setDeviceSchedules(newDeviceSchedules)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  } */


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
            <span className='text-sm text-muted-foreground'>{deviceStatus ? 'Encendido' : 'Apagado'}</span>
            <Switch
              className='cursor-pointer'
              checked={deviceStatus}
              disabled={device.status === 'offline' || isLoading}
              onCheckedChange={(value) => handleDeviceToggle(device.device_id, value)}
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
        {deviceSchedules && deviceSchedules.length > 0 &&
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
          ))
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
      /* onSchedule={onSchedule} */
      />

    </Card>
  )
}