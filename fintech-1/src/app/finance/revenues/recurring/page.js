import Link from "next/link";

export default function Recurring() {
    return (
        <div>
            <div className="flex w-full justify-between min-h-screen gap-10 font-[family-name:var(--font-geist-sans)]">
                <div className="w-full flex flex-col items-center sm:items-start">
                    <div className="sidebar-top-section w-full h-[70px] px-7.5 py-5 flex items-center justify center gap-2.5 text-sm">
                        <Link className="font-semibold" href="/">
                            Home
                        </Link>
                        <span className="text-xs font-semibold">{'>'}</span>
                        <Link className="font-semibold" href="/finance">
                            Finance
                        </Link>
                        <span className="text-xs font-semibold">{'>'}</span>
                        <Link className="font-semibold" href="/finance/revenues">
                            Revenues
                        </Link>
                        <span className="text-xs font-semibold">{'>'}</span>
                        <span>
                            Recurring
                        </span>
                    </div>
                    <section className="w-full flex items-center justify-between px-7.5 py-5">
                        <h1 className="text-4xl font-[family-name:var(--font-geist-sans)] font-black">Recurring</h1>
                        <div className="flex gap-2.5 items-center">
                            <select className="p-2.5 bg-stone-800 rounded-4xl outline-none">
                                <option value="custom">Add a custom data source</option>
                                <option value="exact">Exact Online</option>
                                <option value="afas">AFAS</option>
                            </select>
                        </div>
                    </section>

                    <section>

                    </section>
                </div>
            </div>
        </div>
    ); 
}