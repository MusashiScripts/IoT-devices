import { Clock, Trash } from 'lucide-react'
import { Button } from './ui/button'
import { Schedule } from '@/lib/types'

interface Props {
  deviceSchedules: Schedule[]
  createHandleDeleteSchedule: (scheduelId: string) => () => Promise<void>
  isLoading: boolean
}

export const SchedulesList = ({ deviceSchedules, createHandleDeleteSchedule, isLoading }: Props) => {
  return (
    deviceSchedules.map(schedule => (
      <div key={schedule.schedule_id} className='bg-blue-50 text-xs text-blue-700 px-2 py-0.5 rounded-md flex items-center justify-between'>
        <div className='flex items-center gap-1'>
          <Clock className='size-3' />
          <span>Programado: {schedule.action} a las {schedule.time}</span>
        </div>
        <Button variant='link' size='icon' className='cursor-pointer text-blue-700 p-0 hover:text-red-500 transition-colors'
          onClick={createHandleDeleteSchedule(schedule.schedule_id)} disabled={isLoading}>
          <Trash />
        </Button>
      </div>
    ))
  )
}