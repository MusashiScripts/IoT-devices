import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const { data, error } = await supabase.from('devices').select('name, isOn').eq('device_id', id).single()
    console.log(data)

    if (error) {
      console.log(error)
      return NextResponse.json({
        error: true,
        message: error.message,
        details: error.details,
        code: error.code
      }, { status: 400 })
    }

    console.log(data)

    return NextResponse.json({
      error: false,
      data,
      message: 'Successfully'
    }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({
      error: true,
      message: 'Server Error'
    }, { status: 500 })
  }
}