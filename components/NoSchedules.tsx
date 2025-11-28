import { Badge } from './ui/badge'

export const NoSchedules = () => {
  return (
    <div className='flex items-center justify-center'>
      <Badge className='bg-slate-700'>
        Sin programaciones
      </Badge>
    </div>
  )
}