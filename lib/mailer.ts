import nodemailer from 'nodemailer';

// Configure this with your actual SMTP credentials in production
// For now, it will use an ethereal email (or fail gracefully if not configured)
// but we will console.log the emails so you can see them during development.

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
    pass: process.env.SMTP_PASS || 'ethereal_password',
  },
});

export const sendBookingConfirmation = async (email: string, name: string, preferredDate: string, timeSlot: string) => {
  const mailOptions = {
    from: '"Pibotix Consultations" <consultations@pibotix.com>',
    to: email,
    subject: 'Consultation Request Received - Pibotix',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for requesting a consultation with Pibotix Engineering.</p>
      <p>We have received your request for <strong>${preferredDate} at ${timeSlot}</strong>.</p>
      <p>Our team is reviewing your project details and will confirm your appointment shortly.</p>
      <br />
      <p>Best regards,</p>
      <p>The Pibotix Team</p>
    `
  };

  try {
    if (process.env.NODE_ENV !== 'production' && !process.env.SMTP_USER) {
      console.log('--- EMAIL MOCK ---');
      console.log('To:', email);
      console.log('Subject:', mailOptions.subject);
      console.log('Body:', mailOptions.html);
      return { success: true, message: 'Mock email sent' };
    }
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
};

export const sendStatusUpdateEmail = async (email: string, name: string, status: string, date: string, timeSlot: string) => {
  let subject = '';
  let body = '';

  if (status === 'approved' || status === 'scheduled') {
    subject = 'Consultation Confirmed - Pibotix';
    body = `
      <h2>Hello ${name},</h2>
      <p>Great news! Your consultation request has been <strong>approved</strong>.</p>
      <p>We look forward to meeting with you on <strong>${date} at ${timeSlot}</strong>.</p>
      <p>You will receive a meeting link shortly before the appointment.</p>
      <br />
      <p>Best regards,</p>
      <p>The Pibotix Team</p>
    `;
  } else if (status === 'rejected') {
    subject = 'Consultation Update - Pibotix';
    body = `
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out to Pibotix.</p>
      <p>Unfortunately, we are unable to accommodate your consultation request at this time. Our team will reach out if our availability changes.</p>
      <br />
      <p>Best regards,</p>
      <p>The Pibotix Team</p>
    `;
  } else if (status === 'rescheduled') {
    subject = 'Consultation Rescheduled - Pibotix';
    body = `
      <h2>Hello ${name},</h2>
      <p>Your consultation with Pibotix has been <strong>rescheduled</strong>.</p>
      <p>Your new appointment time is: <strong>${date} at ${timeSlot}</strong>.</p>
      <p>If this time does not work for you, please reply to this email.</p>
      <br />
      <p>Best regards,</p>
      <p>The Pibotix Team</p>
    `;
  } else {
    return { success: false, error: 'Invalid status for email' };
  }

  const mailOptions = {
    from: '"Pibotix Consultations" <consultations@pibotix.com>',
    to: email,
    subject,
    html: body
  };

  try {
    if (process.env.NODE_ENV !== 'production' && !process.env.SMTP_USER) {
      console.log('--- EMAIL MOCK ---');
      console.log('To:', email);
      console.log('Subject:', mailOptions.subject);
      console.log('Body:', mailOptions.html);
      return { success: true, message: 'Mock email sent' };
    }
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending update email:', error);
    return { success: false, error };
  }
};
