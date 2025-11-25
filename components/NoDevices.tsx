import { BotOff } from 'lucide-react'

export const NoDevices = () => {
  return (
    <div className='text-center py-8'>
      <BotOff className='mx-auto size-12 text-muted-foreground mb-4' />
      <h3 className="text-lg font-medium text-muted-foreground mb-2">No tiene dispositivos aún</h3>
      {/* <p className="text-muted-foreground">
        Intenta con otro término de búsqueda
      </p> */}
    </div>
  )
}