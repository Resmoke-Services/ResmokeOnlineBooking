
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// TODO: This URL should be moved to a secure, server-side environment variable
// (e.g., in apphosting.yaml or a .env.local file) instead of being hardcoded.
const WEBHOOK_BASE_URL = "https://primary-production-5528.up.railway.app/webhook-test";

export async function POST(request: Request) {
  if (!WEBHOOK_BASE_URL) {
    console.error('CRITICAL: Webhook base URL is not configured.');
    return NextResponse.json({ message: 'Server configuration error: Webhook URL is missing.' }, { status: 500 });
  }

  try {
    const requestBody = await request.json();

    // The external service expects the webhook name in the body.
    const bodyForWebhook = {
      ...requestBody,
      webhook: "available_time_slots",
    };

    const webhookResponse = await fetch(WEBHOOK_BASE_URL, {
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

    // Attempt to parse as JSON, but fall back to text if it fails
    try {
        const jsonResponse = JSON.parse(responseText);
        return NextResponse.json(jsonResponse);
    } catch (e) {
        return new Response(responseText, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
        });
    }

  } catch (error: any) {
    console.error('Error proxying to availability webhook:', error);
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Bad Request: Invalid JSON format from client' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error while proxying request' }, { status: 500 });
  }
}
