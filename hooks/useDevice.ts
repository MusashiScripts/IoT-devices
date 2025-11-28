import { Device, Schedule } from '@/lib/types'
import { deleteScheduleById, getDeviceSchedule } from '@/services/schedules'
import { useEffect, useRef, useState } from 'react'


export const useDevice = (device: Device, onToggle: (deviceId: string, value: boolean) => Promise<void>) => {
  const [deviceSchedules, setDeviceSchedules] = useState<Schedule[]>([])
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isFirstLoading = useRef(true)


  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const schedule = await getDeviceSchedule(device.device_id)
        setDeviceSchedules(schedule)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
        isFirstLoading.current = false
      }
    }

    fetchSchedule()

  }, [device.device_id])


  const getDeviceVariant = (status: string) => {
    return status === 'offline' ? 'outline' : 'default'
  }

  const handleOpenChange = (value: boolean) => {
    setIsScheduleOpen(value)
  }

  const handleToggle = async (deviceId: string, value: boolean) => {
    //Perfecto, solo falta q sea en tiempo real
    setIsLoading(true)
    try {
      await onToggle(deviceId, value)
    } catch (error) {
      console.log('error, algo fue mal', error)
    } finally {
      setIsLoading(false)
    }

    //Por ahora un refresh para q se vean los cambios pero mejor usar el real-time

    //Ya esta en real-time, por eso router.refresh esta comentado
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

  return { deviceSchedules, isLoading, isFirstLoading, getDeviceVariant, isScheduleOpen, setIsScheduleOpen, handleOpenChange, handleToggle, createHandleDeleteSchedule, addNewSchedule }
}