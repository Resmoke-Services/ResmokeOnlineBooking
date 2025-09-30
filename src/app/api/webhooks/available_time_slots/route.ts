
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AVAILABILITY_WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL_AVAILABLE_TIME_SLOTS;

export async function POST(request: Request) {
  if (!AVAILABILITY_WEBHOOK_URL) {
    console.error('CRITICAL: Availability webhook URL is not configured.');
    return NextResponse.json({ message: 'Server configuration error: Webhook URL is missing.' }, { status: 500 });
  }

  try {
    const requestBody = await request.json();

    const webhookResponse = await fetch(AVAILABILITY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await webhookResponse.text();

    if (!webhookResponse.ok) {
      // Forward the error from the external webhook
      return new Response(responseText, {
        status: webhookResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(responseText, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error proxying to availability webhook:', error);
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Bad Request: Invalid JSON format from client' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error while proxying request' }, { status: 500 });
  }
}
