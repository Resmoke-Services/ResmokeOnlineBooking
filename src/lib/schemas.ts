
import { z } from "zod";
import { repairItems, paymentMethods, billingOptions } from "@/lib/types";
import type { PaymentMethod as PaymentMethodType, BillingInformation as BillingInformationType } from "@/lib/types";

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
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
});

const userDetailsSchema = {
    userName: z.string().min(2, { message: "Your name must be at least 2 characters." }),
    userSurname: z.string().min(2, { message: "Your surname must be at least 2 characters." }),
    userCellNumber: z.string()
      .regex(zaPhoneNumberRegex, { message: "Please enter a valid South African cell number." })
      .transform(phoneTransform),
    userEmail: z.string().email({ message: "Please enter a valid email address." }),
};

export const landlordBookingSchema = z.object({
  landlordName: z.string().min(2, { message: "Landlord's name must be at least 2 characters." }),
  landlordSurname: z.string().min(2, { message: "Landlord's surname must be at least 2 characters." }),
  landlordCellNumber: z.string()
    .regex(zaPhoneNumberRegex, { message: "Please enter a valid South African cell number." })
    .transform(phoneTransform),
  landlordEmail: z.string().email({ message: "Please enter a valid email address for the landlord." }),
  ...userDetailsSchema
});

export const companyBookingSchema = z.object({
    companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    companyPhone: z.string().regex(zaLandlineRegex, { message: "Please enter a valid South African phone number." }).transform(phoneTransform),
    companyEmail: z.string().email({ message: "Please enter a valid company email address." }),
    companyAddress: z.string().min(10, { message: "Company address must be at least 10 characters." }),
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
  ...userDetailsSchema
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
  paymentMethod: z.enum(paymentMethods.map(p => p.id) as [PaymentMethodType, ...PaymentMethodType[]], {
    required_error: "You must select a payment method.",
  }),
   billingInformation: z.enum(billingOptions as [BillingInformationType, ...BillingInformationType[]], {
    required_error: "You must select a billing option.",
  }),
  terms: z.object({
    paymentOnPremises: z.boolean().refine((val) => val === true, {
      message: "You must agree to the payment terms.",
    }),
    emailConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to receive emails.",
    }),
  }),
});
