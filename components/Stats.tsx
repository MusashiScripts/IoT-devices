import { Activity, Wifi, WifiOff, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Props {
  onlineDevices: number | null
  totalDevices: number | undefined
  activeDevices: number | undefined
  totalPowerConsumption: number | undefined
  schedulesCount: number | null
}

export const Stats = ({ onlineDevices, totalDevices, activeDevices, totalPowerConsumption, schedulesCount }: Props) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>

      <Card>
        <CardHeader className='flex items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>Dispositivos Conectados</CardTitle>
          <Wifi className='size-4 text-muted-foreground' />
        </CardHeader>

        <CardContent>
          <h2 className='text-2xl font-bold'>{onlineDevices}</h2>
          <p className='text-xs text-muted-foreground'>de {totalDevices} dispositivos</p>
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
  )
}