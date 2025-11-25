import { WifiOff } from 'lucide-react'
import { DeviceCard } from './DeviceCard'
import { Badge } from './ui/badge'
import { Device } from '@/lib/types'

interface Props {
  filteredDevices: Device[] | undefined
  totalDevices: number | undefined
  onlineDevices: number | null
  offlineDevices: number | null
  handleDeviceToggle: (deviceId: string, value: boolean) => Promise<void>
}

export const DeviceGrid = ({ filteredDevices, totalDevices, onlineDevices, offlineDevices, handleDeviceToggle }: Props) => {
  return (
    filteredDevices?.length === 0 ? (
      <div className='text-center py-8'>
        <WifiOff className='mx-auto size-12 text-muted-foreground mb-4' />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No se encontraron resultados</h3>
        <p className="text-muted-foreground">
          Intenta con otro término de búsqueda
        </p>
      </div>
    ) : (
      <div>

        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Dispositivos ({totalDevices})</h2>

          <div className='flex items-center gap-2'>
            <Badge variant='outline' >
              <div className='size-2 rounded-full bg-green-500 mr-2' />
              {onlineDevices} En línea
            </Badge>
            <Badge variant='outline' >
              <div className='size-2 rounded-full bg-red-500 mr-2' />
              {offlineDevices} Desconectados
            </Badge>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredDevices?.map(device => (
            <DeviceCard key={device.device_id} device={device} onToggle={handleDeviceToggle} />
          ))}
        </div>
      </div>
    )
  )
}