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
    }

    if (data) {
      return data
    }

  } catch (error) {
    console.error(error)
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