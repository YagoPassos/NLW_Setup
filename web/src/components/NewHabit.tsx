import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";

const availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sabádo'
]

export function NewHabit() {

    const [title, setTitle] = useState('');
    const [weekDays, setWeekDays] = useState<number[]>([]);

    async function createNewHabit(event: FormEvent) {
        event.preventDefault();
        if (!title) {
            alert('Favor inserir um título.')
            return
        }
        if (weekDays.length === 0) {
            alert('Favor marcar os dias correspondentes.')
            return
        }
        console.log({
            title,
            weekDays
        })
        await api.post('habits', {
            title,
            weekDays
        })

        setTitle('')
        setWeekDays([])
        alert('Hábito criado com sucesso')
    }

    function handleToggleWeekDay(day: number) {
        if (weekDays.includes(day)) {

            const weekDaysFiltered = weekDays.filter(e => e !== day)

            setWeekDays(weekDaysFiltered)

        } else {
            setWeekDays([...weekDays, day])
        }
    }


    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu compromentimento?
            </label>

            <input type="text" id="tittle" placeholder="ex.: Exercicios, dormir bem, etc..." autoFocus
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                value={title}
                onChange={e => {
                    setTitle(e.target.value)
                }}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência ?
            </label>

            <div className='mt-3 flex flex-col gap-2'>
                {availableWeekDays.map((day, i) =>
                (
                    <Checkbox.Root key={day} className='flex items-center gap-3 group'
                        checked={weekDays.includes(i)}
                        onCheckedChange={() => {
                            handleToggleWeekDay(i);
                        }}
                    >
                        <div className='transition-colors h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
                            <Checkbox.Indicator>
                                <Check size={20} className='text-white' />
                            </Checkbox.Indicator>
                        </div>
                        <span className='text-white leading-tigh'>
                            {day}
                        </span>
                    </Checkbox.Root>
                ))}
            </div>

            <button type="submit" className="transition-colors mt-6 rounded-lg p-4 flex items-center justify-center font-semibold bg-green-600 hover:bg-green-500 gap-3">
                <Check size={20} weight='bold' />
                Confirmar
            </button>
        </form>
    )
}