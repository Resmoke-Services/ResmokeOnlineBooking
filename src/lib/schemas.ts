
import { z } from "zod";
import { cities, suburbs, propertyTypes, accessCodeOptions, propertyFunctions, rentalUnitRoles, billingOptions } from "@/lib/types";
import type { PaymentMethod as PaymentMethodType } from "@/lib/types";

const zaPhoneNumberRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;

export const customerProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters." }),
  cellNumber: z.string()
    .regex(zaPhoneNumberRegex, { message: "Please enter a valid South African cell number (e.g., 0821234567)." })
    .transform((val) => val.startsWith("0") ? `+27${val.substring(1)}` : val),
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
  propertyFunction: z.enum(propertyFunctions, {
    required_error: "You need to select a property function.",
  }),
  rentalUnitRole: z.enum(rentalUnitRoles).optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  billingInformation: z.enum(billingOptions, {
    required_error: "You need to select a billing information option.",
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
}).refine(data => {
    if (data.propertyFunction === 'Rental Unit' && !data.rentalUnitRole) {
        return false;
    }
    return true;
}, {
    message: "Please select your role for the rental unit.",
    path: ["rentalUnitRole"],
}).refine(data => {
    if (data.propertyFunction === 'Company' && (!data.companyName || data.companyName.trim().length < 2)) {
        return false;
    }
    return true;
}, {
    message: "Company name must be at least 2 characters.",
    path: ["companyName"],
}).refine(data => {
    if (data.propertyFunction === 'Company' && (!data.companyAddress || data.companyAddress.trim().length < 5)) {
        return false;
    }
    return true;
}, {
    message: "Company address must be at least 5 characters.",
    path: ["companyAddress"],
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

    