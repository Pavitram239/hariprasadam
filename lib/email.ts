import nodemailer from 'nodemailer';
import { Enquiry } from './types';

export async function sendEnquiryEmail(enquiry: Enquiry) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const recipient = process.env.NOTIFICATION_EMAIL || 'info@hariprasadam.com';

  const formattedDate = new Date(enquiry.created_at).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const subject = `New Website Enquiry – HariPrasadam [${enquiry.enquiry_type}]`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Enquiry - HariPrasadam</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fdfbf7; color: #1a1412; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e7dfd5; border-radius: 8px; overflow: hidden; }
          .header { background: #1a1412; color: #fdfbf7; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; letter-spacing: 1px; color: #c59b3f; }
          .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.8; }
          .content { padding: 24px; }
          .field { margin-bottom: 16px; border-bottom: 1px solid #f2ede4; padding-bottom: 12px; }
          .field:last-child { border-bottom: none; }
          .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #7a6e65; font-weight: 600; margin-bottom: 4px; }
          .value { font-size: 15px; color: #1a1412; font-weight: 500; }
          .message-box { background: #faf7f2; border: 1px solid #e7dfd5; border-radius: 6px; padding: 14px; font-size: 14px; line-height: 1.5; color: #2e2621; }
          .footer { background: #faf7f2; padding: 16px; text-align: center; font-size: 12px; color: #8a7e75; border-top: 1px solid #e7dfd5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HARI PRASADAM</h1>
            <p>New Website Enquiry Received</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Customer Name</div>
              <div class="value">${enquiry.name}</div>
            </div>
            <div class="field">
              <div class="label">Phone Number</div>
              <div class="value"><a href="tel:${enquiry.phone}">${enquiry.phone}</a></div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value">${enquiry.email ? `<a href="mailto:${enquiry.email}">${enquiry.email}</a>` : 'Not provided'}</div>
            </div>
            <div class="field">
              <div class="label">Company Name</div>
              <div class="value">${enquiry.company || 'Not provided'}</div>
            </div>
            <div class="field">
              <div class="label">Enquiry Type</div>
              <div class="value" style="color: #c59b3f; font-weight: bold;">${enquiry.enquiry_type}</div>
            </div>
            <div class="field">
              <div class="label">Estimated Quantity</div>
              <div class="value">${enquiry.quantity || 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Source Page / Product</div>
              <div class="value">${enquiry.source_page} ${enquiry.product_name ? `(${enquiry.product_name})` : ''}</div>
            </div>
            <div class="field">
              <div class="label">Date & Time</div>
              <div class="value">${formattedDate}</div>
            </div>
            <div class="field">
              <div class="label">Customer Message</div>
              <div class="message-box">${enquiry.message.replace(/\n/g, '<br/>')}</div>
            </div>
          </div>
          <div class="footer">
            HariPrasadam Pvt. Ltd. • Surat, Gujarat • +91 9909 799369
          </div>
        </div>
      </body>
    </html>
  `;

  if (!host || !user || !pass) {
    console.log('--- EMAIL NOTIFICATION (MOCK/DEV MODE) ---');
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Customer: ${enquiry.name} | Phone: ${enquiry.phone} | Type: ${enquiry.enquiry_type}`);
    console.log(`Message: ${enquiry.message}`);
    console.log('-----------------------------------------');
    return { success: true, mocked: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"HariPrasadam Website" <${user}>`,
      to: recipient,
      subject,
      html: htmlContent,
    });

    return { success: true, mocked: false };
  } catch (error) {
    console.error('Failed to send notification email:', error);
    return { success: false, error };
  }
}
