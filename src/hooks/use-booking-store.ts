
"use client";

import type { BookingData, BookingSlot, AvailabilitySlot, WebhookConfirmation, UserProfile, PropertyType, AccessCodeRequired, Suburb } from '@/lib/types';
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
  setPropertyType: (propertyType: PropertyType) => void;
  setAccessCodeRequired: (accessCodeRequired: AccessCodeRequired) => void;
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
  propertyType: null,
  accessCodeRequired: null,
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
      setPropertyType: (propertyType) => set({ propertyType }),
      setAccessCodeRequired: (accessCodeRequired) => set({ accessCodeRequired }),
      setSelectedDateTime: (selectedDateTime) => set({ selectedDateTime }),
      setAvailability: (availability) => set({ availability }),
      setWebhookConfirmation: (webhookConfirmation) => set({ webhookConfirmation }),
      resetBooking: () => set(initialState),
    }),
    {
      name: 'resmoke-booking-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
