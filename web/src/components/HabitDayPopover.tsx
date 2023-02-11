import * as Checkbox from '@radix-ui/react-checkbox'
import dayjs from 'dayjs';
import { Check } from "phosphor-react";
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { ProgressBar } from "./ProgressBar";

interface HabitDayPopoverProps {
    onCompletedChanged: (completed: number)=> void
    date: Date,
    dayOfTheWeek: string,
    dayAndMonth: string,
    status: number
}

interface Habits {
    possibleHabits: Array<{
        created_at: string,
        id: string,
        title: string,
    }>,
    completedHabits: string[],
}

export function HabitDayPopover({ dayAndMonth, dayOfTheWeek, status, date, onCompletedChanged }: HabitDayPopoverProps) {

    const [habits, setHabits] = useState<Habits>()

    useEffect(() => {
        api.get('day', {
            params: {
                date: date.toISOString(),
            }
        }).then(response => {
            setHabits(response.data)
            console.log(response.data)
        })
    }, [])

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date)


    async function handleToggleHabits(habitID: string) {
        await api.patch(`/habits/${habitID}/toggle`)

        const isHabitAlreadyCompleted = habits!.completedHabits.includes(habitID)

        let completedHabits: string[] = []

        if (isHabitAlreadyCompleted) {
            completedHabits = habits!.completedHabits.filter(id => id !== habitID)
        } else {
            completedHabits = [...habits!.completedHabits, habitID]
        }

        setHabits({
            possibleHabits: habits!.possibleHabits,
            completedHabits
        })

        onCompletedChanged(completedHabits.length)
    }

    return (
        <>
            <span className='font-semibold text-zinc-400'>{dayOfTheWeek}</span>
            <span className='mt-1 font-extrabold leading-tight text-3xl'>{dayAndMonth}</span>
            <ProgressBar progress={status} />

            <div className='mt-6 flex flex-col gap-3'>
                {habits?.possibleHabits.map(habit =>
                (
                    <Checkbox.Root
                        key={habit.id}
                        onCheckedChange={() => {
                            handleToggleHabits(habit.id)
                        }}
                        disabled={isDateInPast}
                        checked={habits.completedHabits.includes(habit.id)}
                        className='flex items-center gap-3 group focus:outline-none'>

                        <div className='transition-colors h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
                            <Checkbox.Indicator>
                                <Check size={20} className='text-white' />
                            </Checkbox.Indicator>
                        </div>
                        <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                            {habit.title}
                        </span>

                    </Checkbox.Root>

                ))}
            </div>
        </>

    )
}