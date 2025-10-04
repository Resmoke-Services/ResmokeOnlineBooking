
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// TODO: Move this URL to a server-side environment variable for better security and flexibility.
// For example, in apphosting.yaml or a .env file.
const WEBHOOK_BASE_URL = "https://primary-production-5528.up.railway.app/webhook-test";


export async function POST(request: Request) {
  if (!WEBHOOK_BASE_URL) {
    console.error('CRITICAL: Confirmation webhook URL is not configured.');
    return NextResponse.json({ message: 'Server configuration error: Webhook URL is missing.' }, { status: 500 });
  }

  try {
    const requestBody = await request.json();

    // The external service expects the webhook name in the body.
    const bodyForWebhook = {
      ...requestBody,
      webhook: "booking_confirmation",
    };

    const webhookResponse = await fetch(WEBHOOK_BASE-URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyForWebhook),
    });

    const responseText = await webhookResponse.text();
    
    if (!webhookResponse.ok) {
      // Forward the error from the external webhook
      return new Response(responseText, {
        status: webhookResponse.status,
        headers: { 'Content-Type': webhookResponse.headers.get('Content-Type') || 'application/json' },
      });
    }

    return new Response(responseText, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error proxying to confirmation webhook:', error);
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Bad Request: Invalid JSON format from client' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error while proxying request' }, { status: 500 });
  }
}
