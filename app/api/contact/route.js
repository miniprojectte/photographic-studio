import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, date, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create HTML email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #0D0D0D; color: #ffffff; padding: 30px; border-radius: 12px;">
          <h1 style="color: #C45D3E; font-size: 28px; margin-bottom: 10px;">
            New Contact Form Submission
          </h1>
          <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 30px;">
            You have received a new inquiry from your photography studio website.
          </p>
          
          <div style="background-color: rgba(255, 255, 255, 0.04); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #D4A853; margin-top: 0; font-size: 16px;">Contact Information</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #C45D3E;">${email}</a></p>
            ${date ? `<p style="margin: 8px 0;"><strong>Event Date:</strong> ${date}</p>` : ''}
          </div>

          <div style="background-color: rgba(255, 255, 255, 0.04); padding: 20px; border-radius: 8px;">
            <h3 style="color: #D4A853; margin-top: 0; font-size: 16px;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; margin: 0;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.5); font-size: 12px;">
            <p>This email was sent from the NM Studios contact form.</p>
          </div>
        </div>
      </div>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'NM Studios <onboarding@resend.dev>',
      to: 'delivered@resend.dev', // Test email - change to your verified email
      subject: `New Contact Form: ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Email sent successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}

