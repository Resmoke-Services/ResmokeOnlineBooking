
import { z } from "zod";
import { cities, suburbs, propertyTypes, accessCodeOptions, paymentMethods } from "@/lib/types";
import type { PaymentMethod as PaymentMethodType } from "@/lib/types";

// Regex to validate South African phone numbers
// Supports: 0XXXXXXXXX, +27XXXXXXXXX (with or without space after +27)
const zaPhoneNumberRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;

export const customerProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters." }),
  cellNumber: z.string().regex(zaPhoneNumberRegex, { message: "Please enter a valid South African cell number." }),
  email: z.string().email({ message: "Invalid email address." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.enum(cities, {
    required_error: "You need to select a city.",
  }),
  otherCityDescription: z.string().optional(),
  suburb: z.enum(suburbs, {
    required_error: "You need to select a suburb.",
  }),
  otherSuburbDescription: z.string().optional(),
  propertyType: z.enum(propertyTypes, {
    required_error: "You need to select a property type.",
  }),
  accessCodeRequired: z.enum(accessCodeOptions, {
    required_error: "You need to select an option for access code.",
  }),
}).refine(data => {
    if (data.suburb === 'Other' && (!data.otherSuburbDescription || data.otherSuburbDescription.trim().length < 3)) {
        return false;
    }
    return true;
}, {
    message: "Please specify your suburb (min. 3 characters).",
    path: ["otherSuburbDescription"],
}).refine(data => {
    if (data.city === 'Other' && (!data.otherCityDescription || data.otherCityDescription.trim().length < 3)) {
        return false;
    }
    return true;
}, {
    message: "Please specify your city (min. 3 characters).",
    path: ["otherCityDescription"],
});

export const itemToRepairSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  descriptions: z.record(z.string()).optional(),
}).refine((data) => {
    if (data.items.includes("OTHER") && (!data.descriptions?.['OTHER'] || data.descriptions['OTHER'].trim().length < 6)) {
        return false;
    }
    return true;
}, {
    message: "Please provide a description for the 'Other' item (min. 6 characters).",
    path: ["descriptions.OTHER"],
}).refine((data) => {
    for (const item of data.items) {
        if (!data.descriptions?.[item] || data.descriptions[item].trim().length < 6) {
            return false;
        }
    }
    return true;
}, {
    message: "Please describe the problem for each selected item (min. 6 characters).",
    path: ["descriptions"],
});

export const paymentAndTermsSchema = z.object({
  paymentMethod: z.array(z.string()).refine((value): value is PaymentMethodType[] => value.length > 0, {
    message: "You must select at least one payment method.",
  }),
  terms: z.object({
    paymentOnPremises: z.boolean().refine((val) => val === true, {
      message: "You must agree to the payment terms.",
    }),
    emailConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to receive emails.",
    }),
    smsConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to receive text messages.",
    }),
  }),
});
