import { createClient } from '@/utils/supabase/server'
import { DashboardClient } from './DashboardClient'

export async function Dashboard() {

  const supabase = await createClient()
  const { data: devices, error } = await supabase.from('devices')
    .select('device_id ,created_at, name, type, status, isOn,location, powerConsumption, lastUpdated')
  //console.log(devices)

  if (error) {
    console.error(error)
  }

  const { count: schedulesCount, error: schedulesError } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true })
    .eq('enabled', true)

  if (schedulesError) {
    console.error(schedulesError)
  }


  return (
    <DashboardClient initialDevices={devices} schedulesCount={schedulesCount} />
  )
}