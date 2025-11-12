
import {
    YtdSummary,
    Invoice,
    InvoiceStatus,
    QuickStats,
    Shipment,
    ShipmentStatus,
    ShipmentDetails,
    Claim,
    ClaimStatus,
    ClaimReason,
    NewClaim,
} from '../types';

// --- MOCK DATA ---

const mockInvoices: Invoice[] = [
    { invoiceId: 'INV-2024-034', weekPeriod: 'Aug 26 - Sep 1, 2024', weekNumber: 35, packagesShipped: 120, invoiceAmount: 1450.75, status: InvoiceStatus.Paid },
    { invoiceId: 'INV-2024-033', weekPeriod: 'Aug 19 - Aug 25, 2024', weekNumber: 34, packagesShipped: 115, invoiceAmount: 1390.50, status: InvoiceStatus.Paid },
    { invoiceId: 'INV-2024-032', weekPeriod: 'Aug 12 - Aug 18, 2024', weekNumber: 33, packagesShipped: 130, invoiceAmount: 1575.00, status: InvoiceStatus.Paid },
    { invoiceId: 'INV-2024-035', weekPeriod: 'Sep 2 - Sep 8, 2024', weekNumber: 36, packagesShipped: 125, invoiceAmount: 1512.25, status: InvoiceStatus.Pending },
];

const mockYtdSummary: YtdSummary = {
    totalPackagesYtd: 4980,
    avgRevenuePerPackage: 12.15,
    totalYtdRevenue: 60507.00,
    weeksProcessed: 35,
};

const mockShipments: Shipment[] = [
   { trackingNumber: 'JD014600002931892351', status: ShipmentStatus.InTransit, origin: 'New York, NY', destination: 'Chicago, IL', destinationAddress: '6670 N Ionia Ave Chicago 60646 IL', createdDate: '2024-09-10' },
   { trackingNumber: 'JD014600002931892352', status: ShipmentStatus.Exception, origin: 'Chicago, IL', destination: 'Houston, TX', destinationAddress: '12414 Kleingate Ln Houston 77066 TX', createdDate: '2024-09-09' },
   { trackingNumber: 'JD014600002931892353', status: ShipmentStatus.InTransit, origin: 'Houston, TX', destination: 'East Northport, NY', destinationAddress: '20 MEDFORD LN East Northport 11731 NY', createdDate: '2024-09-11' },
];

const mockShipmentDetails: { [key: string]: ShipmentDetails } = {
    'JD014600002931892351': {
        trackingNumber: 'JD014600002931892351', status: ShipmentStatus.InTransit, origin: 'New York, NY', destination: 'Chicago, IL', destinationAddress: '6670 N Ionia Ave Chicago 60646 IL', createdDate: '2024-09-10',
        weight: 5.2, length: 12, width: 8, height: 4, deliveryDate: null, shippingAddress: '6670 N Ionia Ave Chicago 60646 IL',
        events: [
            { timestamp: '2024-09-11 08:00 AM', status: 'In transit to destination', location: 'St. Louis, MO' },
            { timestamp: '2024-09-10 05:30 PM', status: 'Departed origin facility', location: 'New York, NY' },
            { timestamp: '2024-09-10 02:15 PM', status: 'Package received by carrier', location: 'New York, NY' },
        ]
    }
};

let mockClaims: Claim[] = [
    { claimId: 'CLM-98765', packageId: 'JD014600002931892340', reason: ClaimReason.Damaged, status: ClaimStatus.Approved, dateSubmitted: '2024-08-15' },
    { claimId: 'CLM-98766', packageId: 'JD014600002931892341', reason: ClaimReason.Lost, status: ClaimStatus.UnderReview, dateSubmitted: '2024-09-01' },
];

// --- API FUNCTIONS ---

const simulateApiCall = <T,>(data: T, delay = 500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const getInvoiceHistory = () => simulateApiCall(mockInvoices);
export const getYtdSummary = () => simulateApiCall(mockYtdSummary);
export const downloadInvoiceCsv = (invoiceId: string) => {
    console.log(`Downloading CSV for invoice: ${invoiceId}`);
    return Promise.resolve();
};

export const getQuickStats = (): Promise<QuickStats> => {
    const stats: QuickStats = {
        packagesInTransit: mockShipments.filter(s => s.status === ShipmentStatus.InTransit).length,
        exceptionPackages: mockShipments.filter(s => s.status === ShipmentStatus.Exception).length,
        totalPackagesInRange: mockShipments.length
    };
    return simulateApiCall(stats);
};

export const getOpenShipments = () => simulateApiCall(mockShipments);

export const getShipmentDetails = (trackingNumber: string): Promise<ShipmentDetails | null> => {
    return simulateApiCall(mockShipmentDetails[trackingNumber] || null);
};

export const getRecentClaims = () => simulateApiCall(mockClaims);

export const submitClaim = (newClaim: NewClaim): Promise<Claim> => {
    const claim: Claim = {
        claimId: `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
        packageId: newClaim.packageId,
        reason: newClaim.reason,
        status: ClaimStatus.UnderReview,
        dateSubmitted: new Date().toISOString().split('T')[0],
    };
    mockClaims = [claim, ...mockClaims];
    return simulateApiCall(claim, 1000);
};