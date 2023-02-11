import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useState } from 'react'
import { HabitDayPopover } from './HabitDayPopover'


interface HabitDaysProps {
    date: Date,
    defaultCompleted?: number
    amount?: number
}

export function HabitDay({ defaultCompleted = 0, amount = 0, date }: HabitDaysProps) {

    const [completed, setCompleted] = useState(defaultCompleted)

    const status = amount > 0 ? Math.round((completed / amount) * 100) : 0

    const dayAndMonth = dayjs(date).format('DD/MM')
    const dayOfTheWeek = dayjs(date).format('dddd')

    function handleCompletedChanged(completed: number){
        setCompleted(completed)
    }

    return (
        <Popover.Root>
            <Popover.Trigger className={clsx('focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background  w-10 h-10 cursor-pointer rounded-lg transition-colors ease-in-out',
                {
                    'bg-zinc-900 border-2 border-zinc-800': status == 0,
                    'bg-violet-900 border-violet-800': status > 0 && status <= 20,
                    'bg-violet-800 border-violet-700': status >= 20 && status <= 40,
                    'bg-violet-700 border-violet-600': status >= 40 && status <= 60,
                    'bg-violet-600 border-violet-500': status >= 60 && status <= 80,
                    'bg-violet-500 border-violet-400': status >= 80,
                })} />

            <Popover.Portal>
                <Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col'>
                    <HabitDayPopover onCompletedChanged={handleCompletedChanged} date={date} status={status} dayAndMonth={dayAndMonth} dayOfTheWeek={dayOfTheWeek}/>
                    <Popover.Arrow height={8} className=' fill-zinc-900' />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}