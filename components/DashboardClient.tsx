'use client'

import { Device } from '@/lib/types'
import { DeviceGrid } from './DevicesGrid'
import { Stats } from './Stats'
import { useDashboard } from '@/hooks/useDashboard'
import { Searching } from './Searching'

interface Props {
  initialDevices: Device[] | null
  schedulesCount: number | null
}

export const DashboardClient = ({ initialDevices, schedulesCount }: Props) => {
  const {
    devices,
    searchTerm,
    handleChange,
    handleDeviceToggle,
    onlineDevices,
    offlineDevices,
    totalPowerConsumption,
    activeDevices,
    filteredDevices
  } = useDashboard({ initialDevices })

  return (
    <main className='max-w-7xl mx-auto px-4px-4 sm:px-6 lg:px-8 py-8'>

      {/* Stats */}
      <Stats onlineDevices={onlineDevices} totalDevices={devices?.length} activeDevices={activeDevices} totalPowerConsumption={totalPowerConsumption} schedulesCount={schedulesCount} />

      {/* Search */}
      <Searching searchTerm={searchTerm} handleChange={handleChange} />

      {/* Devices Grid */}
      <DeviceGrid filteredDevices={filteredDevices} totalDevices={devices?.length} onlineDevices={onlineDevices} offlineDevices={offlineDevices} handleDeviceToggle={handleDeviceToggle} />

    </main>
  )
}