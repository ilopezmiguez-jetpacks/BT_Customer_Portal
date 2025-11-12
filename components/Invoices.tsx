import React, { useState, useEffect } from 'react';
import { getInvoiceHistory, getYtdSummary, downloadInvoiceCsv } from '../services/api';
import { YtdSummary, Invoice, InvoiceStatus } from '../types';
import { ArchiveBoxArrowDownIcon, BanknotesIcon, CalendarDaysIcon, ChartBarIcon, CubeIcon } from './icons/Icons';

const YtdCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-brand-lightblue/20 text-brand-blue">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-xl font-bold text-brand-dark">{value}</p>
            </div>
        </div>
    </div>
);

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [summary, setSummary] = useState<YtdSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [invoiceData, summaryData] = await Promise.all([
                    getInvoiceHistory(),
                    getYtdSummary()
                ]);
                setInvoices(invoiceData);
                setSummary(summaryData);
            } catch (error) {
                console.error("Failed to fetch invoice data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading invoices...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-brand-dark">Invoices</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <YtdCard title="Total Packages YTD" value={summary?.totalPackagesYtd.toLocaleString() ?? '0'} icon={<CubeIcon className="w-6 h-6"/>}/>
                <YtdCard title="Avg Revenue / Package" value={`$${summary?.avgRevenuePerPackage.toFixed(2)}`} icon={<ChartBarIcon className="w-6 h-6"/>}/>
                <YtdCard title="Total YTD Revenue" value={`$${summary?.totalYtdRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`} icon={<BanknotesIcon className="w-6 h-6"/>}/>
                <YtdCard title="Weeks Processed" value={summary?.weeksProcessed.toString() ?? '0'} icon={<CalendarDaysIcon className="w-6 h-6"/>}/>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-brand-dark mb-4">Invoice History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">INVOICE ID</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">WEEK PERIOD</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">WEEK #</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">PACKAGES SHIPPED</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">INVOICE AMOUNT</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">STATUS</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             {invoices.map((invoice) => (
                                <tr key={invoice.invoiceId}>
                                    <td className="p-3 text-sm text-gray-700 font-medium">{invoice.invoiceId}</td>
                                    <td className="p-3 text-sm text-gray-700">{invoice.weekPeriod}</td>
                                    <td className="p-3 text-sm text-gray-700">{invoice.weekNumber}</td>
                                    <td className="p-3 text-sm text-gray-700">{invoice.packagesShipped}</td>
                                    <td className="p-3 text-sm text-gray-700">${invoice.invoiceAmount.toFixed(2)}</td>
                                    <td className="p-3 text-sm">
                                         <span className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg ${
                                            invoice.status === InvoiceStatus.Paid ? 'bg-green-200 text-green-800' :
                                            invoice.status === InvoiceStatus.Pending ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-red-200 text-red-800'
                                        }`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm">
                                        <button onClick={() => downloadInvoiceCsv(invoice.invoiceId)} className="text-brand-lightblue hover:text-brand-blue">
                                            <ArchiveBoxArrowDownIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Invoices;