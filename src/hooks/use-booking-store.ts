
"use client";

import type { BookingData, BookingSlot, AvailabilitySlot, WebhookConfirmation, UserProfile, PropertyType, AccessCodeRequired, Suburb, RepairItem } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookingState extends BookingData {
  availability: AvailabilitySlot[];
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  setName: (name: string) => void;
  setSurname: (surname: string) => void;
  setCellNumber: (cellNumber: string) => void;
  setEmail: (email: string) => void;
  setAddress: (address: string) => void;
  setSuburb: (suburb: Suburb) => void;
  setOtherSuburbDescription: (description: string) => void;
  setPropertyType: (propertyType: PropertyType) => void;
  setAccessCodeRequired: (accessCodeRequired: AccessCodeRequired) => void;
  setItemsToRepair: (items: RepairItem[]) => void;
  setOtherItemDescription: (description: string) => void;
  setSelectedDateTime: (dateTime: BookingSlot | null) => void;
  setAvailability: (availability: AvailabilitySlot[]) => void;
  setWebhookConfirmation: (data: WebhookConfirmation | null) => void;
  resetBooking: () => void;
}

const initialBookingData: Omit<BookingData, 'user'> = {
  name: '',
  surname: '',
  cellNumber: '',
  email: '',
  address: '',
  suburb: undefined,
  otherSuburbDescription: '',
  propertyType: null,
  accessCodeRequired: null,
  itemsToRepair: [],
  otherItemDescription: '',
  selectedDateTime: null,
  webhookConfirmation: null,
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
      setSuburb: (suburb) => set({ suburb }),
      setOtherSuburbDescription: (otherSuburbDescription) => set({ otherSuburbDescription }),
      setPropertyType: (propertyType) => set({ propertyType }),
      setAccessCodeRequired: (accessCodeRequired) => set({ accessCodeRequired }),
      setItemsToRepair: (itemsToRepair) => set({ itemsToRepair }),
      setOtherItemDescription: (otherItemDescription) => set({ otherItemDescription }),
      setSelectedDateTime: (selectedDateTime) => set({ selectedDateTime }),
      setAvailability: (availability) => set({ availability }),
      setWebhookConfirmation: (webhookConfirmation) => set({ webhookConfirmation }),
      resetBooking: () => set(initialState),
    }),
    {
      name: 'resmoke-booking-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

    