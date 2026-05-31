import { NextResponse } from 'next/server';
import crypto from 'crypto';

function generateSignature(data, passPhrase) {
  const params = Object.keys(data)
    .filter((k) => data[k] !== '' && data[k] !== undefined)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(String(data[k]).trim()).replace(/%20/g, '+')}`)
    .join('&');

  const signatureString = passPhrase ? `${params}&passphrase=${encodeURIComponent(passPhrase.trim())}` : params;
  return crypto.createHash('md5').update(signatureString).digest('hex');
}

export async function POST(request) {
  try {
    const { amount, itemName, studentEmail, studentName, tutorId, sessionType } = await request.json();

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passPhrase = process.env.PAYFAST_PASSPHRASE;

    if (!merchantId || !merchantKey) {
      return NextResponse.json({
        success: true,
        paymentUrl: '/dashboard/student',
        message: 'PayFast credentials not configured — redirecting to dashboard (demo mode).',
        demo: true,
      });
    }

    const isSandbox = merchantId === '10000100';
    const baseUrl = isSandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/student?payment=success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/student?payment=cancelled`;
    const notifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payfast/notify`;

    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      email_address: studentEmail || '',
      amount: parseFloat(amount).toFixed(2),
      item_name: itemName || `NextGen Tutors - ${sessionType || 'Session'}`,
      custom_str1: tutorId || '',
      custom_str2: sessionType || 'single',
    };

    const signature = generateSignature(paymentData, passPhrase);
    paymentData.signature = signature;

    const formParams = new URLSearchParams(paymentData).toString();

    return NextResponse.json({
      success: true,
      paymentUrl: `${baseUrl}?${formParams}`,
      sandbox: isSandbox,
    });
  } catch (error) {
    console.error('PayFast API error:', error);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}
