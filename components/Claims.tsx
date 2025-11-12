
import React, { useState, useEffect } from 'react';
import { getRecentClaims, submitClaim } from '../services/api';
import { Claim, NewClaim, ClaimReason, ClaimStatus } from '../types';

const Claims: React.FC = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loadingClaims, setLoadingClaims] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [newClaim, setNewClaim] = useState<NewClaim>({
        packageId: '',
        contactEmail: '',
        reason: ClaimReason.Damaged,
        description: '',
        contactPhone: '',
    });

    const fetchClaims = async () => {
        setLoadingClaims(true);
        try {
            const claimsData = await getRecentClaims();
            setClaims(claimsData);
        } catch (error) {
            console.error("Failed to fetch claims:", error);
        } finally {
            setLoadingClaims(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewClaim(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitClaim(newClaim);
            setNewClaim({ packageId: '', contactEmail: '', reason: ClaimReason.Damaged, description: '', contactPhone: '' });
            setShowForm(false);
            await fetchClaims();
        } catch (error) {
            console.error("Failed to submit claim:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-dark">Claims</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90"
                >
                    {showForm ? 'Cancel' : 'Submit New Claim'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-brand-dark mb-4">New Claim Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Package / Shipment ID</label>
                                <input type="text" name="packageId" value={newClaim.packageId} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-lightblue focus:ring-brand-lightblue text-brand-dark bg-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                                <input type="email" name="contactEmail" value={newClaim.contactEmail} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-lightblue focus:ring-brand-lightblue text-brand-dark bg-white"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Reason for Claim</label>
                                <select name="reason" value={newClaim.reason} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-lightblue focus:ring-brand-lightblue text-brand-dark bg-white">
                                    {Object.values(ClaimReason).map(reason => <option key={reason} value={reason}>{reason}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Phone (Optional)</label>
                                <input type="tel" name="contactPhone" value={newClaim.contactPhone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-lightblue focus:ring-brand-lightblue text-brand-dark bg-white"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={newClaim.description} onChange={handleInputChange} rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-lightblue focus:ring-brand-lightblue text-brand-dark bg-white"/>
                        </div>
                        <div className="text-right">
                             <button type="submit" disabled={submitting} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 disabled:bg-gray-400">
                                {submitting ? 'Submitting...' : 'Submit Claim'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-brand-dark mb-4">Recent Claims</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Claim ID</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Package ID</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Reason</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Status</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Date Submitted</th>
                                <th className="p-3 text-sm font-semibold text-gray-700 tracking-wide">Actions</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100">
                            {loadingClaims ? (
                                <tr><td colSpan={6} className="p-4 text-center">Loading claims...</td></tr>
                            ) : (
                                claims.map((claim) => (
                                    <tr key={claim.claimId}>
                                        <td className="p-3 text-sm text-gray-700">{claim.claimId}</td>
                                        <td className="p-3 text-sm text-brand-lightblue font-medium">{claim.packageId}</td>
                                        <td className="p-3 text-sm text-gray-700">{claim.reason}</td>
                                        <td className="p-3 text-sm">
                                             <span className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg ${
                                                claim.status === ClaimStatus.Approved ? 'bg-green-200 text-green-800' :
                                                claim.status === ClaimStatus.Rejected ? 'bg-red-200 text-red-800' :
                                                'bg-yellow-200 text-yellow-800'
                                            }`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">{claim.dateSubmitted}</td>
                                        <td className="p-3 text-sm text-gray-700">
                                            <button className="text-brand-lightblue hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default Claims;