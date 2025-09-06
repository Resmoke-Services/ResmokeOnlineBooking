
"use client";

import type { BookingData, AvailabilitySlot, WebhookConfirmation, UserProfile, RepairItem, PaymentMethod, TermsAgreement, BookingSlot, BookingFor, BillingInformation, AddressDetails } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookingState extends BookingData {
  availability: AvailabilitySlot[];
  setUser: (user: UserProfile | null) => void;
  setUserProfile: (profileData: Partial<BookingData>) => void;
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

const initialBookingData: Omit<BookingData, 'user'> = {
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
};

const initialState = {
  ...initialBookingData,
  availability: [],
  user: null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      setUserProfile: (profileData) => set((state) => ({ ...state, ...profileData })),
      setBookingFor: (bookingFor) => set({ bookingFor }),
      setPersonalDetails: (details) => set({ ...details }),
      setAddressDetails: (details: AddressDetails) => set((state) => {
        let formattedAddress = '';
        if (details.propertyType === 'Home') {
            formattedAddress = `${details.houseNumber} ${details.streetName}, ${details.suburb}, ${details.city}`;
        } else if (details.propertyType === 'Complex') {
            formattedAddress = `Unit ${details.unitNumber}, ${details.complexName}, ${details.streetNumber} ${details.streetName}, ${details.suburb}, ${details.city}`;
        } else if (details.propertyType === 'Estate') {
            formattedAddress = `Stand ${details.standNumber}, ${details.houseNumber} ${details.streetNameInEstate}, ${details.estateName}, ${details.suburb}, ${details.city}`;
        } else if (details.propertyType === 'Complex in an Estate') {
            formattedAddress = `Unit ${details.unitNumber}, ${details.complexName}, ${details.streetNameInEstate}, ${details.estateName}, ${details.suburb}, ${details.city}`;
        } else if (details.propertyType === 'Office') {
            formattedAddress = `${details.officeName}, ${details.officeParkName ? details.officeParkName + ', ' : ''}${details.streetNumber} ${details.streetName}, ${details.suburb}, ${details.city}`;
        } else if (details.propertyType === 'Small Holding') {
            formattedAddress = `${details.holdingName}, ${details.streetName}, ${details.suburb}, ${details.city}`;
        } else if (details.propertyType === 'Farm') {
            formattedAddress = `${details.farmName}, ${details.streetName}, ${details.suburb}, ${details.city}`;
        } else if (details.propertyType === 'Other') {
            formattedAddress = `${details.otherPropertyType}, ${details.streetNumber} ${details.streetName}, ${details.suburb}, ${details.city}`;
        }
        return { addressDetails: details, formattedAddress };
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
      name: 'resmoke-booking-storage-v3', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
