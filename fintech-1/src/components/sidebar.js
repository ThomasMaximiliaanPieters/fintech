'use client'

import React, { createContext, useContext, useState } from 'react';
import Link from 'next/link';

import { MdAnalytics } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";

import { IoMdArrowForward } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";

const SidebarContext = createContext();

const Sidebar = ({ children }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <aside className='sidebar-component h-screen'>
            <div className={`sidebar-container relative h-full flex-col flex bg-[#121212] shadow-sm ${expanded ? "items-start" : "items-center"}`}>
                <div className="sidebar-top-section px-7.5 py-5 flex items-center justify center">
                    <Link href="/" className="flex title-font font-medium items-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-7.5 h-7.5 text-white p-2 bg-stone-500 rounded-full" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>

                        <span className={`ml-2.5 text-md font-semibold ${expanded ? "flex" : "hidden"}`}>Tailblocks</span>
                    </Link>
                </div>

                <div className={`relative flex items-center gap-5 py-5 ${expanded ? "justify-between px-7.5" : "justify-center px-0"}`}>
                    <IoMdPerson className='size-5' />

                    <div className={`flex flex-col justify-between items-start ${expanded ? "w-50 flex" : "w-0 hidden"}`}>
                        <h4 className='font-semibold'>Name</h4>
                        <span className='text-xs text-gray-300'>email@email.com</span>
                    </div>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className='flex-1 px-5'>{children}</ul>
                </SidebarContext.Provider>

                <button onClick={() => setExpanded(curr => !curr)} className='absolute right-[-19px] bottom-5 z-1000 p-2.5 rounded-full bg-stone-950 hover:bg-stone-700'>
                    {!expanded ? <IoMdArrowForward className='size-4' /> : <IoMdArrowBack className='size-4' />}
                </button>
            </div>
        </aside>
    )
}

export function SidebarItem({ icon, text, active, alert }) {
    const { expanded } = useContext(SidebarContext);
    return (
        <li className={`relative flex items-center gap-2.5 p-2.5 my-1 rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-stone-900 to-stone-700 text-white" : "hover:bg-stone-800"}`}>
            {icon}
            <span className={`font-semibold ${expanded ? "w-50" : "w-0 hidden"}`}>{text}</span>
        </li>
    )
}

export default Sidebar;