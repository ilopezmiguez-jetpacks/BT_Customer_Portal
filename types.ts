
export interface YtdSummary {
    totalPackagesYtd: number;
    avgRevenuePerPackage: number;
    totalYtdRevenue: number;
    weeksProcessed: number;
}

export enum InvoiceStatus {
    Paid = 'Paid',
    Pending = 'Pending',
    Overdue = 'Overdue'
}

export interface Invoice {
    invoiceId: string;
    weekPeriod: string;
    weekNumber: number;
    packagesShipped: number;
    invoiceAmount: number;
    status: InvoiceStatus;
}

export interface QuickStats {
    packagesInTransit: number;
    exceptionPackages: number;
    totalPackagesInRange: number;
}

export enum ShipmentStatus {
    InTransit = 'In Transit',
    Delivered = 'Delivered',
    Exception = 'Exception',
    Pending = 'Pending'
}

export interface Shipment {
    trackingNumber: string;
    status: ShipmentStatus;
    origin: string;
    destination: string;
    destinationAddress: string;
    createdDate: string;
}

export interface ShipmentEvent {
    timestamp: string;
    status: string;
    location: string;
}

export interface ShipmentDetails extends Shipment {
    weight: number;
    length: number;
    width: number;
    height: number;
    deliveryDate: string | null;
    shippingAddress: string;
    events: ShipmentEvent[];
}

export enum ClaimStatus {
    UnderReview = 'Under Review',
    Approved = 'Approved',
    Rejected = 'Rejected'
}

export enum ClaimReason {
    Damaged = 'Damaged Package',
    Lost = 'Lost Package',
    Delayed = 'Delayed Delivery'
}

export interface Claim {
    claimId: string;
    packageId: string;
    reason: ClaimReason;
    status: ClaimStatus;
    dateSubmitted: string;
}

export interface NewClaim {
    packageId: string;
    contactEmail: string;
    reason: ClaimReason;
    description: string;
    contactPhone?: string;
}