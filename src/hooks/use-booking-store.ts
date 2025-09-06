
"use client";

import type { BookingData, AvailabilitySlot, WebhookConfirmation, UserProfile, RepairItem, PaymentMethod, TermsAgreement, BookingSlot, BookingFor, BillingInformation } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookingState extends BookingData {
  availability: AvailabilitySlot[];
  setUser: (user: UserProfile | null) => void;
  setUserProfile: (profileData: Partial<BookingData>) => void;
  setBookingFor: (bookingFor: BookingFor) => void;
  setPersonalDetails: (details: { name: string; surname: string; cellNumber: string; email: string }) => void;
  setAddress: (address: string) => void;
  setSuburb: (suburb: string) => void;
  setCity: (city: string) => void;
  setPropertyType: (propertyType: string) => void;
  setPropertyFunction: (propertyFunction: string) => void;
  setAccessCodeRequired: (required: boolean) => void;
  setLandlordDetails: (details: { landlordName: string; landlordSurname: string; landlordCellNumber: string; landlordEmail: string; }) => void;
  setOwnerDetails: (details: { ownerName: string; ownerSurname: string; ownerCellNumber: string; ownerEmail: string; }) => void;
  setCompanyDetails: (details: { companyName: string; companyPhone: string; companyEmail: string; companyAddress: string; }) => void;
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
  address: '',
  city: '',
  suburb: '',
  propertyType: '',
  propertyFunction: 'Private',
  accessCodeRequired: false,
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
  companyAddress: '',

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
      setAddress: (address) => set({ address }),
      setSuburb: (suburb) => set({ suburb }),
      setCity: (city) => set({ city }),
      setPropertyType: (propertyType) => set({ propertyType }),
      setPropertyFunction: (propertyFunction) => set({ propertyFunction }),
      setAccessCodeRequired: (accessCodeRequired) => set({ accessCodeRequired }),
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
      name: 'resmoke-booking-storage-v2', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
