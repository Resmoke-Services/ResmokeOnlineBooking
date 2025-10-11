
import { z } from "zod";
import { repairItems, paymentMethods, propertyTypes, propertyFunctions, cities } from "@/lib/types";
import type { PaymentMethod as PaymentMethodType, PropertyType } from "@/lib/types";

const zaPhoneNumberRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;
const zaLandlineRegex = /^(?:\+27|0)[0-9]{9}$/; // More generic for landlines/other numbers

const phoneTransform = (val: string) => val.startsWith("0") ? `+27${val.substring(1)}` : val;

export const personalBookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters." }),
  cellNumber: z.string()
    .regex(zaPhoneNumberRegex, { message: "Please enter a valid South African cell number (e.g., 0821234567)." })
    .transform(phoneTransform),
  email: z.string().email({ message: "Invalid email address." }),
});

const userDetailsSchema = z.object({
    userName: z.string().min(2, { message: "Your name must be at least 2 characters." }),
    userSurname: z.string().min(2, { message: "Your surname must be at least 2 characters." }),
    userCellNumber: z.string()
      .regex(zaPhoneNumberRegex, { message: "Please enter a valid South African cell number." })
      .transform(phoneTransform),
    userEmail: z.string().email({ message: "Please enter a valid email address." }),
});

export const landlordBookingSchema = z.object({
  landlordName: z.string().min(2, { message: "Landlord's name must be at least 2 characters." }),
  landlordSurname: z.string().min(2, { message: "Landlord's surname must be at least 2 characters." }),
  landlordCellNumber: z.string()
    .regex(zaPhoneNumberRegex, { message: "Please enter a valid South African cell number." })
    .transform(phoneTransform),
  landlordEmail: z.string().email({ message: "Please enter a valid email address for the landlord." }),
  ...userDetailsSchema.shape,
});

export const companyBookingSchema = z.object({
    companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    companyPhone: z.string().regex(zaLandlineRegex, { message: "Please enter a valid South African phone number." }).transform(phoneTransform),
    companyEmail: z.string().email({ message: "Please enter a valid company email address." }),
    contactName: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
    contactSurname: z.string().min(2, { message: "Contact surname must be at least 2 characters." }),
    contactCellNumber: z.string()
      .regex(zaPhoneNumberRegex, { message: "Please enter a valid South African cell number." })
      .transform(phoneTransform),
    contactEmail: z.string().email({ message: "Please enter a valid email for the contact person." }),
});

export const friendBookingSchema = z.object({
  ownerName: z.string().min(2, { message: "Friend/Family's name must be at least 2 characters." }),
  ownerSurname: z.string().min(2, { message: "Friend/Family's surname must be at least 2 characters." }),
  ownerCellNumber: z.string()
    .regex(zaPhoneNumberRegex, { message: "Please enter a valid South African cell number." })
    .transform(phoneTransform),
  ownerEmail: z.string().email({ message: "Please enter a valid email address for your friend/family." }),
  ...userDetailsSchema.shape,
});


export const itemToRepairSchema = z.object({
  items: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
  descriptions: z.record(z.string()).optional(),
}).refine(data => {
    // If 'OTHER' is the only item selected, or one of the items, its description is required.
    if (data.items.includes('OTHER')) {
        return data.descriptions?.['OTHER'] && data.descriptions['OTHER'].trim().length >= 6;
    }
    return true;
}, {
    message: "Please describe the 'OTHER' item (min. 6 characters).",
    path: ["descriptions.OTHER"], // Point error to the specific field
});

export const paymentAndTermsSchema = z.object({
  paymentMethod: z.enum(paymentMethods.map(p => p.id) as [PaymentMethodType, ...PaymentMethodType[]], {
    required_error: "You must select a payment method.",
  }),
   billingInformation: z.string({
    required_error: "You must select a billing option.",
   }).min(1, { message: "You must select a billing option." }),
  terms: z.object({
    paymentOnPremises: z.boolean().refine((val) => val === true, {
      message: "You must agree to the payment terms.",
    }),
    emailConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to receive emails.",
    }),
  }),
});


// Base schema with fields common to most property types
const baseAddressSchema = z.object({
    propertyType: z.enum(propertyTypes, { required_error: 'Please select a property type.' }),
    propertyFunction: z.enum(propertyFunctions),
    city: z.enum(cities, { required_error: 'Please select a city.'}),
    otherCityDescription: z.string().optional(),
    suburb: z.string({ required_error: 'Please select a suburb.'}).min(1, "Suburb is required."),
    otherSuburb: z.string().optional(),
});

// Discriminated union for address details based on propertyType
export const addressDetailsSchema = z.discriminatedUnion("propertyType", [
    baseAddressSchema.extend({
        propertyType: z.literal("Home"),
        houseNumber: z.string().min(1, "House number is required."),
        streetName: z.string().min(2, "Street name is required."),
    }),
    baseAddressSchema.extend({
        propertyType: z.literal("Complex"),
        unitNumber: z.string().min(1, "Unit/House number is required."),
        complexName: z.string().min(1, "Complex name is required."),
        otherComplexName: z.string().optional(),
        streetNumber: z.string().optional(),
        streetName: z.string().min(2, "Street name is required."),
        accessCodeRequired: z.enum(['yes', 'no'], { required_error: 'Please select an option for access code.' }),
    }),
    baseAddressSchema.extend({
        propertyType: z.literal("House in an Estate"),
        standNumber: z.string().min(1, "Stand number is required."),
        houseNumber: z.string().min(1, "House number is required."),
        streetNameInEstate: z.string().min(2, "Street name is required."),
        estateName: z.string().min(2, "Estate name is required."),
        accessCodeRequired: z.enum(['yes', 'no'], { required_error: 'Please select an option for access code.' }),
    }),
    baseAddressSchema.extend({
        propertyType: z.literal("Complex in an Estate"),
        unitNumber: z.string().min(1, "Unit/House number is required."),
        complexName: z.string().min(1, "Complex name is required."),
        otherComplexName: z.string().optional(),
        streetNameInEstate: z.string().min(2, "Street name is required."),
        estateName: z.string().min(2, "Estate name is required."),
        accessCodeRequired: z.enum(['yes', 'no'], { required_error: 'Please select an option for access code.' }),
    }),
    baseAddressSchema.extend({
        propertyType: z.literal("Office"),
        officeName: z.string().min(2, "Office/Building name is required."),
        officeParkName: z.string().optional(),
        streetNumber: z.string().optional(),
        streetName: z.string().min(2, "Street name is required."),
        accessCodeRequired: z.enum(['yes', 'no'], { required_error: 'Please select an option for access code.' }),
    }),
    baseAddressSchema.extend({
        propertyType: z.literal("Small Holding"),
        holdingName: z.string().min(2, "Holding name/number is required."),
        streetName: z.string().min(2, "Street/Road name is required."),
    }),
    baseAddressSchema.extend({
        propertyType: z.literal("Farm"),
        farmName: z.string().min(2, "Farm name/number is required."),
        streetName: z.string().min(2, "Road name is required."),
    }),
    baseAddressSchema.extend({
        propertyType: z.literal("OTHER"),
        otherPropertyType: z.string().min(3, "Please specify the property type."),
        streetNumber: z.string().optional(),
        streetName: z.string().min(2, "Street name is required."),
    }),
]).refine(data => {
    if (data.city === 'Other') {
        return data.otherCityDescription && data.otherCityDescription.length > 2;
    }
    return true;
}, {
    message: "Please specify the city/area name (min 3 characters).",
    path: ['otherCityDescription'],
}).refine(data => {
    if (data.suburb === 'OTHER') {
        return data.otherSuburb && data.otherSuburb.length > 2;
    }
    return true;
}, {
    message: "Please specify the suburb (min 3 characters).",
    path: ['otherSuburb'],
}).refine(data => {
    if ((data.propertyType === 'Complex' || data.propertyType === 'Complex in an Estate') && data.complexName === 'OTHER') {
        return data.otherComplexName && data.otherComplexName.length > 2;
    }
    return true;
}, {
    message: "Please specify the complex name (min 3 characters).",
    path: ['otherComplexName'],
});
