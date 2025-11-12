
import React, { useState } from 'react';
import { getShipmentDetails } from '../services/api';
import { ShipmentDetails, ShipmentEvent } from '../types';
import { MagnifyingGlassIcon } from './icons/Icons';

const ShipmentDetailItem: React.FC<{ label: string; value: string | number | null }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-brand-dark">{value || 'N/A'}</p>
    </div>
);

const EventTimeline: React.FC<{ events: ShipmentEvent[] }> = ({ events }) => (
    <div>
        <h3 className="text-lg font-semibold text-brand-dark mb-4">Event History</h3>
        <ol className="relative border-l border-gray-200">
            {events.map((event, index) => (
                <li key={index} className="mb-6 ml-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">{event.timestamp}</time>
                    <h4 className="text-base font-semibold text-gray-900">{event.status}</h4>
                    <p className="text-sm font-normal text-gray-500">{event.location}</p>
                </li>
            ))}
        </ol>
    </div>
);


const PackageLookup: React.FC = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [details, setDetails] = useState<ShipmentDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!trackingNumber) {
            setError('Please enter a tracking number.');
            return;
        }
        setLoading(true);
        setError(null);
        setDetails(null);
        try {
            const result = await getShipmentDetails(trackingNumber);
            if (result) {
                setDetails(result);
            } else {
                setError('Tracking number not found.');
            }
        } catch (err) {
            setError('An error occurred while fetching details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-brand-dark">Package Lookup</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number..."
                        className="flex-grow form-input rounded-md border-gray-300 focus:ring-brand-lightblue focus:border-brand-lightblue text-brand-dark placeholder:text-gray-500 bg-white"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="flex items-center justify-center px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 disabled:bg-gray-400"
                    >
                        <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {details && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <EventTimeline events={details.events} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <h3 className="text-lg font-semibold text-brand-dark border-b pb-2">Shipment Details</h3>
                        <ShipmentDetailItem label="Tracking Number" value={details.trackingNumber} />
                        <ShipmentDetailItem label="Status" value={details.status} />
                        <ShipmentDetailItem label="Origin" value={details.origin} />
                        <ShipmentDetailItem label="Destination" value={details.destination} />
                        <ShipmentDetailItem label="Shipping Address" value={details.shippingAddress} />
                        <ShipmentDetailItem label="Creation Date" value={details.createdDate} />
                        <ShipmentDetailItem label="Est. Delivery Date" value={details.deliveryDate} />
                        <ShipmentDetailItem label="Weight (lbs)" value={details.weight} />
                        <ShipmentDetailItem label="Dimensions (in)" value={`${details.length}x${details.width}x${details.height}`} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackageLookup;