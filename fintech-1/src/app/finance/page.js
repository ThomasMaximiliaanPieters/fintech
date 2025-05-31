import Link from "next/link";

import LineChartComponent from '../../components/LineChart';
import BarChartComponent from "@/components/BarChart";

export default function Finance() {
    return (
        <div>
            <div className="flex w-full justify-between min-h-screen gap-10 font-[family-name:var(--font-geist-sans)]">
                <div className="w-full flex flex-col items-center sm:items-start">
                    <div className="sidebar-top-section w-full h-[70px] px-7.5 py-5 flex items-center justify center gap-2.5 text-sm">
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
                            <select className="p-2.5 bg-stone-800 rounded-4xl outline-none">
                                <option value="custom">Add a custom data source</option>
                                <option value="exact">Exact Online</option>
                                <option value="afas">AFAS</option>
                            </select>
                        </div>
                    </section>

                    <section className="flex px-7.5 py-5 gap-10 w-full">
                        <div className="bg-stone-800 p-5 py-10 w-full rounded-4xl h-[50vh]">
                            <LineChartComponent />
                        </div>

                        <div className="bg-stone-800 p-5 py-10 w-[50%] rounded-4xl h-[50vh]">
                            <BarChartComponent />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}