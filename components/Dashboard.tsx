import { LogOut, Wifi, WifiOff, Zap, Activity, Search } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { mockDevices } from '@/lib/constants'
import { useState } from 'react'
import { Badge } from './ui/badge'
import { DeviceCard } from './DeviceCard'
import type { Device } from '@/lib/types'

interface DashboardProps {
  user: { username: string }
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [devices, setDevices] = useState(mockDevices)
  const [searchTerm, setSearchTerm] = useState('')

  const handleDeviceToggle = (deviceId: string) => {
    const newDevices = devices.map(device => device.id === deviceId ? { ...device, isOn: !device.isOn, lastUpdated: 'ahora' } : device)
    setDevices(newDevices)
  }

  const handleDeviceSchedule = (deviceId: string, schedule: Device['schedule']) => {
    setDevices(devices.map(device =>
      device.id === deviceId ? { ...device, schedule } : device
    ))
  }

  const onlineDevices = devices.filter(device => device.status === 'online').length
  const offlineDevices = devices.length - onlineDevices

  /* const totalPowerConsumption = devices.filter(device => device.isOn).reduce((sum, d) => sum + (d.powerConsumption || 0), 0) */

  const devicesOn = devices.filter(device => device.isOn)
  let totalPowerConsumption = 0
  devicesOn.forEach(device => { totalPowerConsumption += device?.powerConsumption ?? 0 })

  const activeDevices = devicesOn.length
  const scheduledDevices = devices.filter(device => device.schedule?.enabled).length

  const filteredDevices = devices.filter(({ name, type, location }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm border-b'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className='flex justify-between items-center h-16'>

            <div className="flex items-center space-x-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
                <Wifi className="size-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Sistema IoT Control</h1>
                <p className="text-sm text-muted-foreground">Panel de Control</p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <p className='text-sm text-muted-foreground'>Bienvenido, {user.username}</p>
              <Button variant='outline' onClick={onLogout}>
                <LogOut />
                Cerrar Sesion
              </Button>

            </div>

          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>

          <Card>
            <CardHeader className='flex items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Dispositivos Conectados</CardTitle>
              <Wifi className='size-4 text-muted-foreground' />
            </CardHeader>

            <CardContent>
              <h2 className='text-2xl font-bold'>{onlineDevices}</h2>
              <p className='text-xs text-muted-foreground'>de 6 dispositivos</p>
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
              <h2 className='text-2xl font-bold'>{scheduledDevices}</h2>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Devices Grid */}
        {filteredDevices.length === 0 ? (
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
              <h2 className='text-lg font-semibold'>Dispositivos ({devices.length})</h2>

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
              {filteredDevices.map(device => (
                <DeviceCard key={device.id} device={device} onToggle={handleDeviceToggle} onSchedule={handleDeviceSchedule} />
              ))}
            </div>
          </div>
        )}

      </main>

    </section>
  )
}