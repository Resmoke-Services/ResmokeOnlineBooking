
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isGuest: boolean;
}

export type BillingInformation = 'personal' | 'user' | 'owner' | 'landlord' | 'company' | string | null;

export const repairItems = [
    { id: 'DISHWASHER', label: 'DISHWASHER', note: undefined },
    { id: 'MICROWAVE', label: 'MICROWAVE', note: undefined },
    { id: 'OVEN', label: 'OVEN', note: undefined },
    { id: 'TUMBLE_DRYER', label: 'TUMBLE DRYER', note: undefined },
    { id: 'WASHING_MACHINE', label: 'WASHING MACHINE', note: undefined },
    { id: 'FRIDGE', label: 'FRIDGE', note: "We don't do Regas or Compressor Exchange" },
    { id: 'ICE_MACHINE', label: 'ICE MACHINE', note: 'We repair this item at our workshop only' },
    { id: 'TV', label: 'TV', note: 'We repair this item at our workshop only' },
    { id: 'GHD', label: 'GHD', note: 'We repair this item at our workshop only' },
    { id: 'CAR', label: 'CAR', note: 'Diagnostic Scan Onsite - Repairs at Workshop Only' },
    { id: 'OTHER', label: 'Other', note: undefined },
] as const;
export type RepairItem = (typeof repairItems)[number]['id'];
export type RepairItemObject = (typeof repairItems)[number];


export const paymentMethods = [
  { id: "Card", label: "Card (Card Machine)" },
  { id: "EFT", label: "EFT" },
  { id: "PayShap", label: "PayShap" },
] as const;
export type PaymentMethod = (typeof paymentMethods)[number]['id'];

export const propertyTypes = ['Home', 'Complex', 'Estate', 'Complex in an Estate', 'Business', 'Farm', 'Other'] as const;
export const propertyFunctions = ['Private', 'Business'] as const;

export interface TermsAgreement {
    paymentOnPremises: boolean;
    emailConsent: boolean;
}

export interface BookingSlot {
  date: string;
  time: string;
}

export interface WebhookConfirmation {
  status: 'Confirmed' | 'Booked' | 'Failed' | string;
  message?: string;
  dateTime?: string; // The original ISO string from the booking system
  Date?: string;     // e.g., "2024-07-20"
  Time?: string;     // e.g., "14:00"
  error?: string;
  [key: string]: any; // Allow other properties
}


export interface AvailabilitySlot {
  slotStart: string;
}

export type BookingFor = 'personal' | 'landlord' | 'company' | 'friend';

// This is the complete data structure for the entire booking flow
export interface BookingData {
  user: UserProfile | null;
  // Personal details (can be the user, or the contact person for company/friend)
  name: string;
  surname: string;
  cellNumber: string;
  email: string;
  
  // Service address details
  address: string; 
  city: string;
  suburb: string;
  propertyType: string;
  propertyFunction: string;
  accessCodeRequired: boolean;

  // Type of booking
  bookingFor: BookingFor;

  // Landlord details
  landlordName: string;
  landlordSurname: string;
  landlordCellNumber: string;
  landlordEmail: string;
  
  // Owner details (for friend/family)
  ownerName: string;
  ownerSurname: string;
  ownerCellNumber: string;
  ownerEmail: string;

  // Company details
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;

  // Repair details
  itemsToRepair: RepairItem[];
  problemDescriptions: Record<string, string>;
  
  // Payment and confirmation
  paymentMethods: PaymentMethod[];
  billingInformation: BillingInformation | null;
  termsAgreement: TermsAgreement | null;
  selectedDateTime: BookingSlot | null;
  webhookConfirmation: WebhookConfirmation | null;
  
  // Internal tracking
  servicePath: string[];
}
