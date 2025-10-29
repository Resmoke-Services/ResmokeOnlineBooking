
"use client";

import type { BookingData, AvailabilitySlot, WebhookConfirmation, RepairItem, PaymentMethod, TermsAgreement, BookingSlot, BookingFor, BillingInformation, AddressDetails, ServiceType } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookingState extends BookingData {
  availability: AvailabilitySlot[];
  setBookingFor: (bookingFor: BookingFor) => void;
  setPersonalDetails: (details: { name: string; surname: string; cellNumber: string; email: string }) => void;
  setAddressDetails: (details: AddressDetails) => void;
  setLandlordDetails: (details: { landlordName: string; landlordSurname: string; landlordCellNumber: string; landlordEmail: string; }) => void;
  setOwnerDetails: (details: { ownerName: string; ownerSurname: string; ownerCellNumber: string; ownerEmail: string; }) => void;
  setCompanyDetails: (details: { companyName: string; companyPhone: string; companyEmail: string; }) => void;
  setItemsToRepair: (items: RepairItem[]) => void;
  setProblemDescriptions: (descriptions: Record<string, string>) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  setBillingInformation: (billingInformation: BillingInformation) => void;
  setTermsAgreement: (agreement: TermsAgreement | null) => void;
  setSelectedDateTime: (dateTime: BookingSlot | null) => void;
  setAvailability: (availability: AvailabilitySlot[]) => void;
  setWebhookConfirmation: (data: WebhookConfirmation | null) => void;
  setServicePath: (path: string[]) => void;
  setServiceType: (type: ServiceType) => void;
  resetBooking: () => void;
}

const initialState: Omit<BookingState, keyof ReturnType<typeof createStoreActions>> = {
  name: '',
  surname: '',
  cellNumber: '',
  email: '',
  addressDetails: {},
  formattedAddress: '',
  
  bookingFor: 'PERSONAL',
  // Landlord
  landlordName: '',
  landlordSurname: '',
  landlordCellNumber: '',
  landlordEmail: '',
  // Owner (Friend/Family)
  ownerName: '',
  ownerSurname: '',
  ownerCellNumber: '',
  ownerEmail: '',
  // Company
  companyName: '',
  companyPhone: '',
  companyEmail: '',

  itemsToRepair: [],
  problemDescriptions: {},
  paymentMethods: [],
  billingInformation: null,
  termsAgreement: null,
  selectedDateTime: null,
  webhookConfirmation: null,
  servicePath: [],
  serviceType: null,
  availability: [],
};

const createStoreActions = (set: (updater: (state: BookingState) => Partial<BookingState> | Partial<BookingState>) => void) => ({
  setBookingFor: (bookingFor: BookingFor) => set(() => ({ bookingFor })),
  setPersonalDetails: (details: { name: string; surname: string; cellNumber: string; email: string }) => set(() => ({ ...details })),
  setAddressDetails: (details: AddressDetails) => set(() => {
    let parts: string[] = [];
    const city = details.city === 'Other' ? details.otherCityDescription : details.city;
    const suburb = details.suburb === 'OTHER' ? details.otherSuburb : details.suburb;

    switch (details.propertyType) {
        case 'Home':
            if (details.houseNumber) parts.push(details.houseNumber);
            if (details.streetName) parts.push(details.streetName);
            break;
        case 'Complex':
            if (details.unitNumber) parts.push(`Unit ${details.unitNumber}`);
            const complex = details.complexName === 'OTHER' ? details.otherComplexName : details.complexName;
            if (complex) parts.push(complex);
            if (details.streetNumber) parts.push(details.streetNumber);
            if (details.streetName) parts.push(details.streetName);
            break;
        case 'House in an Estate':
            if (details.standNumber) parts.push(`Stand ${details.standNumber}`);
            if (details.houseNumber) parts.push(details.houseNumber);
            if (details.streetNameInEstate) parts.push(details.streetNameInEstate);
            if (details.estateName) parts.push(details.estateName);
            break;
        case 'Complex in an Estate':
            if (details.unitNumber) parts.push(`Unit ${details.unitNumber}`);
            const complexInEstate = details.complexName === 'OTHER' ? details.otherComplexName : details.complexName;
            if (complexInEstate) parts.push(complexInEstate);
            if (details.streetNameInEstate) parts.push(details.streetNameInEstate);
            if (details.estateName) parts.push(details.estateName);
            break;
        case 'Office':
            if (details.officeName) parts.push(details.officeName);
            if (details.officeParkName) parts.push(details.officeParkName);
            if (details.streetNumber) parts.push(details.streetNumber);
            if (details.streetName) parts.push(details.streetName);
            break;
        case 'Small Holding':
            if (details.holdingName) parts.push(details.holdingName);
            if (details.streetName) parts.push(details.streetName);
            break;
        case 'Farm':
            if (details.farmName) parts.push(details.farmName);
            if (details.streetName) parts.push(details.streetName);
            break;
        case 'OTHER':
            if (details.otherPropertyType) parts.push(details.otherPropertyType);
            if (details.streetNumber) parts.push(details.streetNumber);
            if (details.streetName) parts.push(details.streetName);
            break;
    }

    if (suburb) parts.push(suburb);
    if (city) parts.push(city);
    
    const formattedAddress = parts.filter(Boolean).join(', ');

    return { 
        addressDetails: details, 
        formattedAddress
    };
  }),
  setLandlordDetails: (details: { landlordName: string; landlordSurname: string; landlordCellNumber: string; landlordEmail: string; }) => set(() => ({ ...details })),
  setOwnerDetails: (details: { ownerName: string; ownerSurname: string; ownerCellNumber: string; ownerEmail: string; }) => set(() => ({ ...details })),
  setCompanyDetails: (details: { companyName: string; companyPhone: string; companyEmail: string; }) => set(() => ({ ...details })),
  setItemsToRepair: (itemsToRepair: RepairItem[]) => set(() => ({ itemsToRepair })),
  setProblemDescriptions: (problemDescriptions: Record<string, string>) => set(() => ({ problemDescriptions })),
  setPaymentMethods: (paymentMethods: PaymentMethod[]) => set(() => ({ paymentMethods })),
  setBillingInformation: (billingInformation: BillingInformation) => set(() => ({ billingInformation })),
  setTermsAgreement: (termsAgreement: TermsAgreement | null) => set(() => ({ termsAgreement })),
  setSelectedDateTime: (selectedDateTime: BookingSlot | null) => set(() => ({ selectedDateTime })),
  setAvailability: (availability: AvailabilitySlot[]) => set(() => ({ availability })),
  setWebhookConfirmation: (webhookConfirmation: WebhookConfirmation | null) => set(() => ({ webhookConfirmation })),
  setServicePath: (servicePath: string[]) => set(() => ({ servicePath })),
  setServiceType: (serviceType: ServiceType) => set(() => ({ serviceType })),
  resetBooking: () => set(() => (initialState)),
});


export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,
      ...createStoreActions(set),
    }),
    {
      name: 'resmoke-booking-storage-v5', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
