
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PackageLookup from './components/PackageLookup';
import Claims from './components/Claims';
import Reports from './components/Reports';
import Invoices from './components/Invoices';
import Access from './components/Access';

const App: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <HashRouter>
            <div className="flex h-screen bg-brand-gray font-sans">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray p-4 sm:p-6 md:p-8">
                        <Routes>
                            <Route path="/" element={<Navigate replace to="/dashboard" />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/package-lookup" element={<PackageLookup />} />
                            <Route path="/claims" element={<Claims />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/invoices" element={<Invoices />} />
                            <Route path="/access" element={<Access />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </HashRouter>
    );
};

export default App;
