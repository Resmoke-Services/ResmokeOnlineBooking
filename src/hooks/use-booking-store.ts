
"use client";

import type { BookingData, AvailabilitySlot, WebhookConfirmation, UserProfile, PropertyType, AccessCodeRequired, Suburb, City, RepairItem, PaymentMethod, TermsAgreement, BookingSlot, PropertyFunction, RentalUnitRole, BillingInformation } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookingState extends BookingData {
  availability: AvailabilitySlot[];
  setUser: (user: UserProfile | null) => void;
  setName: (name: string) => void;
  setSurname: (surname: string) => void;
  setCellNumber: (cellNumber: string) => void;
  setEmail: (email: string) => void;
  setAddress: (address: string) => void;
  setCity: (city: City) => void;
  setOtherCityDescription: (description: string) => void;
  setSuburb: (suburb: Suburb) => void;
  setOtherSuburbDescription: (description: string) => void;
  setPropertyType: (propertyType: PropertyType | null) => void;
  setAccessCodeRequired: (accessCodeRequired: AccessCodeRequired | null) => void;
  setPropertyFunction: (propertyFunction: PropertyFunction | null) => void;
  setRentalUnitRole: (rentalUnitRole: RentalUnitRole | null) => void;
  setCompanyName: (companyName: string) => void;
  setCompanyAddress: (companyAddress: string) => void;
  setItemsToRepair: (items: RepairItem[]) => void;
  setProblemDescriptions: (descriptions: Record<string, string>) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  setTermsAgreement: (agreement: TermsAgreement) => void;
  setSelectedDateTime: (dateTime: BookingSlot | null) => void;
  setAvailability: (availability: AvailabilitySlot[]) => void;
  setWebhookConfirmation: (data: WebhookConfirmation | null) => void;
  setServicePath: (path: string[]) => void;
  setBillingInformation: (billingInformation: BillingInformation | null) => void;
  resetBooking: () => void;
}

const initialBookingData: Omit<BookingData, 'user'> = {
  name: '',
  surname: '',
  cellNumber: '',
  email: '',
  address: '',
  city: undefined,
  otherCityDescription: '',
  suburb: undefined,
  otherSuburbDescription: '',
  propertyType: null,
  accessCodeRequired: null,
  propertyFunction: null,
  rentalUnitRole: null,
  companyName: '',
  companyAddress: '',
  itemsToRepair: [],
  problemDescriptions: {},
  paymentMethods: [],
  termsAgreement: null,
  selectedDateTime: null,
  webhookConfirmation: null,
  servicePath: [],
  billingInformation: null,
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
      setName: (name) => set({ name }),
      setSurname: (surname) => set({ surname }),
      setCellNumber: (cellNumber) => set({ cellNumber }),
      setEmail: (email) => set({ email }),
      setAddress: (address) => set({ address }),
      setCity: (city) => set({ city }),
      setOtherCityDescription: (otherCityDescription) => set({ otherCityDescription }),
      setSuburb: (suburb) => set({ suburb }),
      setOtherSuburbDescription: (otherSuburbDescription) => set({ otherSuburbDescription }),
      setPropertyType: (propertyType) => set({ propertyType }),
      setAccessCodeRequired: (accessCodeRequired) => set({ accessCodeRequired }),
      setPropertyFunction: (propertyFunction) => set({ propertyFunction }),
      setRentalUnitRole: (rentalUnitRole) => set({ rentalUnitRole }),
      setCompanyName: (companyName) => set({ companyName }),
      setCompanyAddress: (companyAddress) => set({ companyAddress }),
      setItemsToRepair: (itemsToRepair) => set({ itemsToRepair }),
      setProblemDescriptions: (problemDescriptions) => set({ problemDescriptions }),
      setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
      setTermsAgreement: (termsAgreement) => set({ termsAgreement }),
      setSelectedDateTime: (selectedDateTime) => set({ selectedDateTime }),
      setAvailability: (availability) => set({ availability }),
      setWebhookConfirmation: (webhookConfirmation) => set({ webhookConfirmation }),
      setServicePath: (servicePath) => set({ servicePath }),
      setBillingInformation: (billingInformation) => set({ billingInformation }),
      resetBooking: () => set(initialState),
    }),
    {
      name: 'resmoke-booking-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

    