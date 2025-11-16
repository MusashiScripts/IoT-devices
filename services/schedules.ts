import { createClient } from '@/utils/supabase/client'

export const getDeviceSchedule = async (deviceId: string) => {
  try {
    const supabase = createClient()
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