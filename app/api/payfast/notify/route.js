import { NextResponse } from 'next/server';
import crypto from 'crypto';

function verifySignature(data, passPhrase) {
  const pfSignature = data.signature;
  const params = Object.keys(data)
    .filter((k) => k !== 'signature' && data[k] !== '')
    .sort()
    .map((k) => `${k}=${encodeURIComponent(String(data[k]).trim()).replace(/%20/g, '+')}`)
    .join('&');

  const signatureString = passPhrase ? `${params}&passphrase=${encodeURIComponent(passPhrase.trim())}` : params;
  const expectedSignature = crypto.createHash('md5').update(signatureString).digest('hex');

  return pfSignature === expectedSignature;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const passPhrase = process.env.PAYFAST_PASSPHRASE || '';

    if (!verifySignature(data, passPhrase)) {
      console.error('PayFast ITN: Invalid signature');
      return new Response('Invalid signature', { status: 400 });
    }

    const paymentStatus = data.payment_status;
    const tutorId = data.custom_str1;
    const sessionType = data.custom_str2;
    const amount = parseFloat(data.amount_gross);

    if (paymentStatus === 'COMPLETE') {
      console.log(`[PayFast] Payment complete: R${amount} for tutor ${tutorId}, type: ${sessionType}`);
      // In production: update Supabase database, create booking, send confirmation email
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('PayFast ITN error:', error);
    return new Response('Error', { status: 500 });
  }
}
