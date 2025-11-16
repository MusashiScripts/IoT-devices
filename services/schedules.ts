import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const getDeviceSchedule = async (deviceId: string) => {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .select()
      .eq('device_id', deviceId)

    if (error) {
      console.log(error)
      return []
    }

    return data ?? []

  } catch (error) {
    console.error(error)
    return []
  }
}

interface newScheduleParams {
  deviceId: string
  enabled: boolean
  action: 'on' | 'off'
  time: string
}

export const createNewSchedule = async ({ deviceId, enabled, action, time }: newScheduleParams) => {
  try {
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('schedules')
      .insert(
        {
          device_id: deviceId,
          enabled,
          action,
          time
        },
      )
      .select()
      .single()

    if (scheduleError) {
      console.log(scheduleError)
      return
    }

    return scheduleData

  } catch (error) {
    console.error(error)
    return
  }
}

export const deleteScheduleById = async (scheduleId: string) => {
  try {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('schedule_id', scheduleId)

    if (error) {
      console.log('Error en la eliminacion', error)
    }

  } catch (error) {
    console.log(error)
  }
}