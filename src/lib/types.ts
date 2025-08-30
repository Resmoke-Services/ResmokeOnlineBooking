
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isGuest: boolean;
}

export type PropertyType = "House" | "Complex" | "Estate" | "Complex in an Estate" | "Other";
export type AccessCodeRequired = "Yes" | "No";

export const cities = [
    "Centurion",
    "Pretoria",
    "Midrand",
    "Other",
] as const;

export type City = (typeof cities)[number];

export const suburbs = [
  "Amberfield",
  "Celtisdal",
  "Centurion CBD",
  "Clubview",
  "Die Hoewes",
  "Doringkloof",
  "Eldoraigne",
  "Hennopspark",
  "Heuweloord",
  "Highveld",
  "Irene",
  "Lyttelton",
  "Pierre van Ryneveld",
  "Raslouw",
  "Rooihuiskraal",
  "Thatchfield",
  "The Reeds",
  "Valhalla",
  "Wierdapark",
  "Zwartkop",
  "Other",
] as const;

export type Suburb = (typeof suburbs)[number];

export const repairItems: { id: string; label: string; note?: string }[] = [
    { id: 'DISHWASHER', label: 'DISHWASHER' },
    { id: 'MICROWAVE', label: 'MICROWAVE' },
    { id: 'OVEN', label: 'OVEN' },
    { id: 'TUMBLE_DRYER', label: 'TUMBLE DRYER' },
    { id: 'WASHING_MACHINE', label: 'WASHING MACHINE' },
    { id: 'FRIDGE', label: 'FRIDGE', note: "We don't do Regas or Compressor Exchange" },
    { id: 'ICE_MACHINE', label: 'ICE MACHINE', note: 'We repair this item at our workshop only' },
    { id: 'TV', label: 'TV', note: 'We repair this item at our workshop only' },
    { id: 'GHD', label: 'GHD', note: 'We repair this item at our workshop only' },
    { id: 'CAR', label: 'CAR', note: 'Diagnostic Scan Onsite - Repairs at Workshop Only' },
    { id: 'OTHER', label: 'Other' },
];

export type RepairItem = (typeof repairItems)[number]['id'];

export type PaymentMethod = "Card" | "Cash" | "EFT";

export interface TermsAgreement {
    paymentOnPremises: boolean;
    emailConsent: boolean;
    smsConsent: boolean;
}

export interface BookingFormData {
  name: string;
  surname: string;
  cellNumber: string;
  email: string;
  address: string;
  city?: City;
  otherCityDescription?: string;
  suburb: Suburb;
  otherSuburbDescription?: string;
  propertyType: PropertyType | null;
  accessCodeRequired: AccessCodeRequired | null;
  itemsToRepair: RepairItem[];
  problemDescriptions: Record<string, string>;
  paymentMethods: PaymentMethod[];
  termsAgreement: TermsAgreement | null;
}

export interface BookingSlot {
  date: string;
  time: string;
}

export type WebhookConfirmation = any;

export interface BookingData extends BookingFormData {
  selectedDateTime: BookingSlot | null;
  webhookConfirmation: WebhookConfirmation | null;
  user: UserProfile | null;
}

export interface AvailabilitySlot {
  slotStart: string;
}

    
