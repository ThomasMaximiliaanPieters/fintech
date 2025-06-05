'use client'

import { useState } from 'react'
import Link from "next/link";

import LineChartComponent from '../../components/LineChart';
import BarChartComponent from "../../components/BarChart";

import PeriodFilter from '../../components/PeriodFilter'

import { FiChevronDown } from 'react-icons/fi'

export default function Finance() {
    const [period, setPeriod] = useState({
        current: 'ALL',
        compare: 'previous', // or 'last_year' or null
    })


    return (
        <div>
            <div className="flex w-full justify-between min-h-screen gap-10 font-[family-name:var(--font-geist-sans)]">
                <div className="w-full flex flex-col items-center sm:items-start">
                    <div className="sidebar-top-section w-full h-[70px] px-7.5 py-5 flex items-center justify-start gap-2.5 text-sm">
                        <Link className="font-semibold" href="/">
                            Home
                        </Link>
                        <span className="text-xs font-semibold">{'>'}</span>
                        <span>
                            Finance
                        </span>
                    </div>
                    <section className="w-full flex items-center justify-between px-7.5 py-5">
                        <h1 className="text-4xl font-[family-name:var(--font-geist-sans)] font-black">Finance</h1>
                        <div className="flex gap-2.5 items-center">
                            <div className="relative">
                                <select className="appearance-none p-2.5 bg-stone-800 rounded-4xl pr-10 text-white outline-none">
                                    <option value="custom">Add a custom data source</option>
                                    <option value="exact">Exact Online</option>
                                    <option value="afas">AFAS</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-3.5 pointer-events-none text-white" />
                            </div>
                            <PeriodFilter value={period} onChange={setPeriod} />
                        </div>
                    </section>

                    <section className="flex px-7.5 py-5 gap-10 w-full">
                        <div className="bg-stone-800 px-2.5 pt-7.5 pb-2.5 w-full rounded-4xl h-[50vh]">
                            <LineChartComponent period={period} />
                        </div>

                        <div className="bg-stone-800 px-2.5 pt-7.5 pb-2.5 w-[50%] rounded-4xl h-[50vh]">
                            <BarChartComponent />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}