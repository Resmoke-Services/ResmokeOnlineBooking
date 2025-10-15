
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const WEBHOOK_URL = "https://primary-production-5528.up.railway.app/webhook/available_timeslots";

export async function POST(request: Request) {
  if (!WEBHOOK_URL) {
    console.error('CRITICAL: Webhook URL is not configured.');
    return NextResponse.json({ message: 'Server configuration error: Webhook URL is missing.' }, { status: 500 });
  }

  try {
    const requestBody = await request.json();

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await webhookResponse.text();

    if (!webhookResponse.ok) {
      // Forward the error from the external webhook
      // We create a new Response object to forward status and headers correctly
      return new Response(responseText, {
        status: webhookResponse.status,
        headers: { 'Content-Type': webhookResponse.headers.get('Content-Type') || 'application/json' },
      });
    }

    // Attempt to parse as JSON, but fall back to text if it fails
    try {
        const jsonResponse = JSON.parse(responseText);
        return NextResponse.json(jsonResponse, { status: webhookResponse.status });
    } catch (e) {
        return new Response(responseText, {
            status: webhookResponse.status,
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
