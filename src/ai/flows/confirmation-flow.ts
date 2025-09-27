'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Define the input schema for the confirmation message generation
const ConfirmationInputSchema = z.object({
  name: z.string().describe("The user's first name"),
  address: z.string().describe("The user's address for the booking"),
  bookingDateTime: z
    .string()
    .describe(
      'The date and time of the booking in a human-readable format (e.g., "July 15, 2024 at 2:00 PM")'
    ),
  bookingStatus: z
    .string()
    .describe(
      'The status of the booking (e.g., "Confirmed", "Pending", "Failed")'
    ),
  webhookMessage: z
    .string()
    .optional()
    .describe('An optional message from the booking system webhook'),
});
export type ConfirmationInput = z.infer<typeof ConfirmationInputSchema>;


// Define the output schema for the confirmation message
const ConfirmationOutputSchema = z.object({
  friendlyMessage: z
    .string()
    .describe(
      'A warm, friendly confirmation message for the user, including all relevant details.'
    ),
  nextSteps: z
    .array(z.string())
    .describe(
      'A list of next steps for the user (e.g., "Look out for a reminder email").'
    ),
});
export type ConfirmationOutput = z.infer<typeof ConfirmationOutputSchema>;


// This is the exported server action that the client component will call.
export async function generateConfirmationMessage(input: ConfirmationInput): Promise<ConfirmationOutput> {
  return confirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConfirmationMessagePrompt',
  input: {schema: ConfirmationInputSchema},
  output: {schema: ConfirmationOutputSchema},
  prompt: `You are an AI assistant for a premier home services company. Your task is to generate a warm and reassuring booking confirmation message for a customer.

    Customer Details:
    - Name: {{{name}}}
    - Address: {{{address}}}
    - Booking Date & Time: {{{bookingDateTime}}}
    - Booking Status: {{{bookingStatus}}}
    {{#if webhookMessage}}- System Message: {{{webhookMessage}}}{{/if}}

    Instructions:
    1.  Start with a warm and friendly tone, addressing the customer by name.
    2.  Confirm the booking details clearly: the service address and the date/time.
    3.  If a system message is provided, subtly weave it into the confirmation. For example, if the message is "Technician assigned," you could say, "We've already assigned a top-rated technician to your slot."
    4.  Provide clear next steps. For example: "You'll receive an SMS reminder 24 hours before your appointment," and "Our technician will call you when they are on their way."
    5.  Keep the overall message concise and easy to read.

    Generate a JSON object with 'friendlyMessage' and 'nextSteps'.`,
});

const confirmationFlow = ai.defineFlow(
  {
    name: 'confirmationFlow',
    inputSchema: ConfirmationInputSchema,
    outputSchema: ConfirmationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      // Fallback in case of an unexpected error from the AI model
      return {
        friendlyMessage: `Thank you for your booking, ${input.name}! Your appointment is confirmed for ${input.bookingDateTime}. We look forward to seeing you at ${input.address}.`,
        nextSteps: [
          "You will receive an email confirmation shortly.",
          "Our technician will contact you when they are on their way.",
          "If you have any questions, please contact our support team."
        ],
      };
    }
    return output;
  }
);
