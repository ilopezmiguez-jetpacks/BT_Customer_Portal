import React, { useState, useEffect } from 'react';
import { getQuickStats, getOpenShipments } from '../services/api';
import { QuickStats, Shipment, ShipmentStatus } from '../types';
import { CubeTransparentIcon, ExclamationTriangleIcon, ArchiveBoxIcon, ArrowRightIcon, ArchiveBoxArrowDownIcon } from './icons/Icons';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    onClick: () => void;
    isActive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick, isActive }) => (
    <div
        onClick={onClick}
        className={`bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
            isActive ? 'ring-2 ring-brand-blue shadow-xl' : 'hover:shadow-lg'
        }`}
    >
        <div className="bg-brand-lightblue/20 text-brand-blue p-3 rounded-full">
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-brand-dark">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<QuickStats | null>(null);
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ShipmentStatus | 'All'>('All');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsData, shipmentsData] = await Promise.all([
                    getQuickStats(),
                    getOpenShipments()
                ]);
                setStats(statsData);
                setShipments(shipmentsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const filteredShipments = shipments.filter(shipment => {
        if (filter === 'All') {
            return true;
        }
        return shipment.status === filter;
    });

    const handleExport = () => {
        if (filteredShipments.length === 0) {
            alert("No data to export.");
            return;
        }

        const headers = ["Tracking #", "Status", "Destination Address", "Created Date"];
        const csvRows = [
            headers.join(','),
            ...filteredShipments.map(s => 
                [s.trackingNumber, s.status, `"${s.destinationAddress}"`, s.createdDate].join(',')
            )
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "shipment_information.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-brand-dark">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Packages in Transit" 
                    value={stats?.packagesInTransit ?? 0} 
                    icon={<CubeTransparentIcon className="h-6 w-6"/>}
                    onClick={() => setFilter(ShipmentStatus.InTransit)}
                    isActive={filter === ShipmentStatus.InTransit}
                />
                <StatCard 
                    title="Exception Packages" 
                    value={stats?.exceptionPackages ?? 0} 
                    icon={<ExclamationTriangleIcon className="h-6 w-6"/>}
                    onClick={() => setFilter(ShipmentStatus.Exception)}
                    isActive={filter === ShipmentStatus.Exception}
                />
                <StatCard 
                    title="Total Packages in Range" 
                    value={stats?.totalPackagesInRange ?? 0} 
                    icon={<ArchiveBoxIcon className="h-6 w-6"/>}
                    onClick={() => setFilter('All')}
                    isActive={filter === 'All'}
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-brand-dark">Shipment Information</h2>
                    <button
                        onClick={handleExport}
                        className="px-3 py-1.5 text-sm bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 flex items-center"
                    >
                        <ArchiveBoxArrowDownIcon className="w-4 h-4 mr-2" />
                        Export
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Tracking #</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Status</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Destination Address</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredShipments.length > 0 ? (
                                filteredShipments.map((shipment) => (
                                    <tr key={shipment.trackingNumber}>
                                        <td className="p-3 text-sm text-brand-lightblue font-medium cursor-pointer hover:underline">{shipment.trackingNumber}</td>
                                        <td className="p-3 text-sm">
                                            <span className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg ${
                                                shipment.status === 'In Transit' ? 'bg-blue-200 text-blue-800' :
                                                shipment.status === 'Exception' ? 'bg-red-200 text-red-800' :
                                                'bg-gray-200 text-gray-800'
                                            }`}>
                                                {shipment.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {shipment.destinationAddress}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">{shipment.createdDate}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No shipments found for the selected category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;