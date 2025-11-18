'use client'

import { Device } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { DeviceCard } from './DeviceCard'
import { Activity, Search, Wifi, WifiOff, Zap } from 'lucide-react'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { createClient } from '@/utils/supabase/client'

interface Props {
  initialDevices: Device[] | null
  schedulesCount: number | null
}

export const DashboardClient = ({ initialDevices, schedulesCount }: Props) => {
  const [devices, setDevices] = useState(initialDevices)

  const supabase = createClient()

  useEffect(() => {

    const channel = supabase.channel('devices-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices' },
        (payload) => {
          //console.log('Change received!', payload)

          const newDevice = payload.new as Device
          const oldDevice = payload.old as Device

          setDevices(prevState => {
            if (!prevState) return prevState

            switch (payload.eventType) {
              case 'INSERT':
                return [...prevState, newDevice]

              case 'DELETE':
                return prevState.filter(device => device.device_id !== oldDevice.device_id)

              case 'UPDATE':
                return prevState.map((device) =>
                  device.device_id === newDevice.device_id
                    ? { ...device, ...newDevice }
                    : device
                )

              default:
                return prevState
            }
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [supabase])

  const onlineDevices = devices && devices?.filter(device => device.status === 'online').length
  const offlineDevices = devices && onlineDevices && devices.length - onlineDevices

  const totalPowerConsumption = devices?.filter(device => device.isOn).reduce((sum, d) => sum + (d.powerConsumption || 0), 0)

  const devicesOn = devices?.filter(device => device.isOn)
  //const totalPowerConsumption = 0
  //devicesOn.forEach(device => { totalPowerConsumption += device?.powerConsumption ?? 0 })

  const activeDevices = devicesOn?.length


  /* const filteredDevices = mockDevices.filter(({ name, type, location }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.toLowerCase().includes(searchTerm.toLowerCase())
  ) */


  return (
    <main className='max-w-7xl mx-auto px-4px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>

        <Card>
          <CardHeader className='flex items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Dispositivos Conectados</CardTitle>
            <Wifi className='size-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <h2 className='text-2xl font-bold'>{onlineDevices}</h2>
            <p className='text-xs text-muted-foreground'>de {devices?.length} dispositivos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Dispositivos Activos</CardTitle>
            <Activity className='size-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <h2 className='text-2xl font-bold'>{activeDevices}</h2>
            <p className='text-xs text-muted-foreground'>encendidos ahora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Consumo total</CardTitle>
            <Zap className='size-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <h2 className='text-2xl font-bold'>{totalPowerConsumption}W</h2>
            <p className='text-xs text-muted-foreground'>consumo actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Programados</CardTitle>
            <WifiOff className='size-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <h2 className='text-2xl font-bold'>{schedulesCount}</h2>
            <p className='text-xs text-muted-foreground'>con horarios activos</p>
          </CardContent>
        </Card>

      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Buscar dispositivos..."
            className="pl-10"
          /* value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} */
          />
        </div>
      </div>

      {/* Devices Grid */}
      {devices?.length === 0 ? (
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
            <h2 className='text-lg font-semibold'>Dispositivos ({devices?.length})</h2>

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
            {devices?.map(device => (
              <DeviceCard key={device.device_id} device={device} />
            ))}
          </div>
        </div>
      )}

    </main>
  )
}