import { Device } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Params {
  initialDevices: Device[] | null
}

export const useDashboard = ({ initialDevices }: Params) => {
  const [devices, setDevices] = useState(initialDevices)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {

    /* const channel = supabase.channel('devices-channel')
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
          }) */

    //Solo en produccion hacer el refresh pq en local funciona como esperaba
    // No se la causa de este bug
    //router.refresh()

    //No funciono

    /*     }
      )
      .subscribe() */

    const channel = supabase.channel('devices-channel')

    // 🔥 SOLO INSERT
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'devices' },
      (payload) => {
        const newDevice = payload.new as Device
        setDevices(prev => prev ? [...prev, newDevice] : prev)
        router.refresh()
      }
    )

    // 🔥 SOLO DELETE
    channel.on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'devices' },
      (payload) => {
        const oldDevice = payload.old as Device
        setDevices(prev => prev?.filter(device => device.device_id !== oldDevice.device_id) ?? prev)
      }
    )

    channel.subscribe()

    //Creo q la solucion es no escuhcar el update pq este esta siendo modificado en la Device Card

    return () => {
      supabase.removeChannel(channel)
    }

  }, [supabase, router])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleDeviceToggle = async (deviceId: string, value: boolean) => {
    //Perfecto, solo falta q sea en tiempo real
    try {
      const now = new Date()
      const date = new Intl.DateTimeFormat('en-CA').format(now)
      //console.log(date) --> "2025-11-13"

      const device = devices?.find(device => device.device_id === deviceId)

      if (!device) return

      const { data, error } = await supabase
        .from('devices')
        .update({ isOn: !device.isOn, lastUpdated: date })
        .eq('device_id', deviceId)
        .select()

      //console.log({ data, error })

      if (data) {
        const newDevices = devices?.map(device =>
          device.device_id === deviceId
            ? { ...device, isOn: !device.isOn, lastUpdated: date }
            : device
        )

        if (newDevices) {
          return setDevices(newDevices)
        }

      }

      if (error) {
        console.log(error)
      }

    } catch (error) {
      console.log('error, algo fue mal', error)
    }

    //Por ahora un refresh para q se vean los cambios pero mejor usar el real-time

    //router.refresh()

    //Ya esta en real-time, por eso router.refresh esta comentado
  }


  const onlineDevices = devices && devices?.filter(device => device.status === 'online').length
  const offlineDevices = devices && onlineDevices && devices.length - onlineDevices

  const totalPowerConsumption = devices?.filter(device => device.isOn).reduce((sum, d) => sum + (d.powerConsumption || 0), 0)

  const devicesOn = devices?.filter(device => device.isOn)
  //const totalPowerConsumption = 0
  //devicesOn.forEach(device => { totalPowerConsumption += device?.powerConsumption ?? 0 })

  const activeDevices = devicesOn?.length


  const filteredDevices = devices?.filter(({ name, type, location }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return { devices, searchTerm, handleChange, handleDeviceToggle, onlineDevices, offlineDevices, totalPowerConsumption, activeDevices, filteredDevices }

}