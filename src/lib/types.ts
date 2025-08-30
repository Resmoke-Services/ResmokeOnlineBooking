
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isGuest: boolean;
}

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

export const propertyTypes = ["House", "Complex", "Estate", "Complex in an Estate", "Other"] as const;
export type PropertyType = (typeof propertyTypes)[number];

export const accessCodeOptions = ["Yes", "No"] as const;
export type AccessCodeRequired = (typeof accessCodeOptions)[number];

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
  { id: "Cash", label: "Cash" },
  { id: "EFT", label: "EFT" },
] as const;
export type PaymentMethod = (typeof paymentMethods)[number]['id'];

export interface TermsAgreement {
    paymentOnPremises: boolean;
    emailConsent: boolean;
    smsConsent: boolean;
}

export interface CustomerProfileData {
  name: string;
  surname: string;
  cellNumber: string;
  email: string;
  address: string;
  city?: City;
  otherCityDescription?: string;
  suburb?: Suburb;
  otherSuburbDescription?: string;
  propertyType?: PropertyType;
  accessCodeRequired?: AccessCodeRequired;
}

export interface ItemToRepairData {
  items: RepairItem[];
  descriptions: Record<string, string>;
}

export interface PaymentAndTermsData {
  paymentMethods: PaymentMethod[];
  termsAgreement: TermsAgreement;
}

export interface BookingSlot {
  date: string;
  time: string;
}

export type WebhookConfirmation = any;

export interface AvailabilitySlot {
  slotStart: string;
}

// This is the complete data structure for the entire booking flow
export interface BookingData {
  user: UserProfile | null;
  name: string;
  surname: string;
  cellNumber: string;
  email: string;
  address: string;
  city?: City;
  otherCityDescription: string;
  suburb?: Suburb;
  otherSuburbDescription: string;
  propertyType: PropertyType | null;
  accessCodeRequired: AccessCodeRequired | null;
  itemsToRepair: RepairItem[];
  problemDescriptions: Record<string, string>;
  paymentMethods: PaymentMethod[];
  termsAgreement: TermsAgreement | null;
  selectedDateTime: BookingSlot | null;
  webhookConfirmation: WebhookConfirmation | null;
}
