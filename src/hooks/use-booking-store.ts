
"use client";

import type { BookingData, AvailabilitySlot, WebhookConfirmation, RepairItem, PaymentMethod, TermsAgreement, BookingSlot, BookingFor, BillingInformation, AddressDetails } from '@/lib/types';
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
  resetBooking: () => void;
}

const initialState: BookingState = {
  name: '',
  surname: '',
  cellNumber: '',
  email: '',
  addressDetails: {},
  formattedAddress: '',
  
  bookingFor: 'personal', // Default value
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
  availability: [],

  // Actions are defined in the store creation, these are just placeholders for the type
  setBookingFor: () => {},
  setPersonalDetails: () => {},
  setAddressDetails: () => {},
  setLandlordDetails: () => {},
  setOwnerDetails: () => {},
  setCompanyDetails: () => {},
  setItemsToRepair: () => {},
  setProblemDescriptions: () => {},
  setPaymentMethods: () => {},
  setBillingInformation: () => {},
  setTermsAgreement: () => {},
  setSelectedDateTime: () => {},
  setAvailability: () => {},
  setWebhookConfirmation: () => {},
  setServicePath: () => {},
  resetBooking: () => {},
};


export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,
      setBookingFor: (bookingFor) => set({ bookingFor }),
      setPersonalDetails: (details) => set({ ...details }),
      setAddressDetails: (details: AddressDetails) => set(() => {
        let parts: string[] = [];
        const city = details.city === 'Other' ? details.otherCityDescription : details.city;
        const suburb = details.suburb === 'Other' ? details.otherSuburb : details.suburb;

        switch (details.propertyType) {
            case 'Home':
                if (details.houseNumber) parts.push(details.houseNumber);
                if (details.streetName) parts.push(details.streetName);
                break;
            case 'Complex':
                if (details.unitNumber) parts.push(`Unit ${details.unitNumber}`);
                const complex = details.complexName === 'Other' ? details.otherComplexName : details.complexName;
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
                const complexInEstate = details.complexName === 'Other' ? details.otherComplexName : details.complexName;
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
            case 'Other':
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
      setLandlordDetails: (details) => set({ ...details }),
      setOwnerDetails: (details) => set({ ...details }),
      setCompanyDetails: (details) => set({ ...details }),
      setItemsToRepair: (itemsToRepair) => set({ itemsToRepair }),
      setProblemDescriptions: (problemDescriptions) => set({ problemDescriptions }),
      setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
      setBillingInformation: (billingInformation) => set({ billingInformation }),
      setTermsAgreement: (termsAgreement) => set({ termsAgreement }),
      setSelectedDateTime: (selectedDateTime) => set({ selectedDateTime }),
      setAvailability: (availability) => set({ availability }),
      setWebhookConfirmation: (webhookConfirmation) => set({ webhookConfirmation }),
      setServicePath: (servicePath) => set({ servicePath }),
      resetBooking: () => set(initialState),
    }),
    {
      name: 'resmoke-booking-storage-v5', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
