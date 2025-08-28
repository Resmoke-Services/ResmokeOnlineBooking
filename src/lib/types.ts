

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isGuest: boolean;
}

export type PropertyType = "House" | "Complex" | "Estate" | "Complex in an Estate" | null;

export interface BookingFormData {
  name: string;
  surname: string;
  cellNumber: string;
  email: string;
  address: string;
  propertyType: PropertyType;
}

export interface BookingSlot {
  date: string;
  time: string;
}

// The shape of the webhook response can vary, so we use `any`
// and perform runtime checks in the component.
export type WebhookConfirmation = any;

export interface BookingData extends BookingFormData {
  selectedDateTime: BookingSlot | null;
  webhookConfirmation: WebhookConfirmation | null;
  user: UserProfile | null;
}

export interface AvailabilitySlot {
  slotStart: string;
}
