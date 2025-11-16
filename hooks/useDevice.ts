import { Device, Schedule } from '@/lib/types'
import { deleteScheduleById, getDeviceSchedule } from '@/services/schedules'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useDevice = (device: Device) => {
  const [deviceStatus, setDeviceStatus] = useState(device.isOn)
  const [deviceSchedules, setDeviceSchedules] = useState<Schedule[]>([])
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


  const getDeviceVariant = (status: string) => {
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
  }

  const addNewSchedule = (schedule: Schedule) => {
    setDeviceSchedules([...deviceSchedules, schedule])
  }

  return { deviceStatus, deviceSchedules, isLoading, getDeviceVariant, isScheduleOpen, setIsScheduleOpen, handleOpenChange, handleDeviceToggle, createHandleDeleteSchedule, addNewSchedule }
}