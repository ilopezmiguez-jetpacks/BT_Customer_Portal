
import React from 'react';
import { UserCircleIcon, BellIcon, Bars3Icon, MagnifyingGlassIcon } from './icons/Icons';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, sidebarOpen }) => {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200 shadow-sm">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none lg:hidden">
                    <Bars3Icon className="h-6 w-6" />
                </button>
                <div className="relative mx-4 lg:mx-0">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                       <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                    </span>
                    <input className="w-32 sm:w-64 form-input pl-10 pr-4 rounded-full bg-gray-100 focus:bg-white focus:ring-brand-lightblue focus:border-brand-lightblue text-brand-dark placeholder:text-gray-500" type="text" placeholder="Search" />
                </div>
            </div>

            <div className="flex items-center">
                <button className="flex text-gray-500 hover:text-brand-blue mx-4">
                    <BellIcon className="h-6 w-6"/>
                </button>

                <div className="flex items-center">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <div className="ml-3 text-right hidden sm:block">
                        <p className="text-sm font-semibold text-brand-dark">Robert Shipper</p>
                        <p className="text-xs text-gray-500">ADMIN</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;