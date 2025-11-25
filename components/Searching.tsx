import { Search } from 'lucide-react'
import { Input } from './ui/input'

interface Props {
  searchTerm: string
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Searching = ({ searchTerm, handleChange }: Props) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder="Buscar dispositivos..."
          className="pl-10"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}