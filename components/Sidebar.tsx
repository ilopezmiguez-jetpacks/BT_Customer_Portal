
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChartPieIcon, MagnifyingGlassCircleIcon, DocumentTextIcon, BanknotesIcon, Cog6ToothIcon, HomeIcon } from './icons/Icons';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            className={`flex items-center px-6 py-3 text-lg transition-colors duration-200 ${
                isActive
                    ? 'text-white bg-brand-lightblue'
                    : 'text-gray-300 hover:bg-brand-blue/50 hover:text-white'
            }`}
        >
            {icon}
            <span className="mx-4 font-medium">{children}</span>
        </NavLink>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    return (
        <>
            <div className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`flex flex-col justify-between bg-brand-dark text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-30`}>
                <div>
                    <div className="text-white text-2xl font-extrabold px-6">
                        <span className="text-brand-lightblue">SHIPPER</span> PORTAL
                    </div>
                    <div className="mt-10 space-y-2">
                        <NavItem to="/dashboard" icon={<HomeIcon className="w-6 h-6" />}>DASHBOARD</NavItem>
                        <NavItem to="/package-lookup" icon={<MagnifyingGlassCircleIcon className="w-6 h-6" />}>PACKAGE LOOKUP</NavItem>
                        <NavItem to="/claims" icon={<DocumentTextIcon className="w-6 h-6" />}>CLAIMS</NavItem>
                        <NavItem to="/reports" icon={<ChartPieIcon className="w-6 h-6" />}>REPORTS</NavItem>
                        <NavItem to="/invoices" icon={<BanknotesIcon className="w-6 h-6" />}>INVOICES</NavItem>
                        <NavItem to="/access" icon={<Cog6ToothIcon className="w-6 h-6" />}>ACCESS</NavItem>
                    </div>
                </div>
                <div className='px-6'>
                    <p className='text-sm text-gray-400'>Shipper Branding Placeholder</p>
                    <p className='text-xs text-gray-500'>© 2024</p>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
