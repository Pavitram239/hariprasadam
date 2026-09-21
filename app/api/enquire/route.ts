import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { insertEnquiry } from '@/lib/storage';
import { sendEnquiryEmail } from '@/lib/email';
import { EnquiryType } from '@/lib/types';

const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  phone: z.string().trim().min(8, 'Please enter a valid phone number (at least 8 digits)'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  company: z.string().trim().optional().or(z.literal('')),
  enquiry_type: z.enum([
    'Corporate Gifting',
    'Bulk Order',
    'Festive Gifting',
    'Customization',
    'Retail',
    'Product Enquiry',
    'Other',
  ] as const),
  quantity: z.string().trim().optional().or(z.literal('')),
  message: z.string().trim().min(5, 'Message must be at least 5 characters'),
  source_page: z.string().default('/'),
  product_name: z.string().optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = enquirySchema.parse(body);

    const savedRecord = await insertEnquiry({
      name: validated.name,
      phone: validated.phone,
      email: validated.email || undefined,
      company: validated.company || undefined,
      enquiry_type: validated.enquiry_type as EnquiryType,
      quantity: validated.quantity || undefined,
      message: validated.message,
      source_page: validated.source_page || '/',
      product_name: validated.product_name || undefined,
      status: 'New',
    });

    // Asynchronously trigger email notification (do not block user response if SMTP is delayed)
    sendEnquiryEmail(savedRecord).catch((err) => {
      console.error('Background email notification error:', err);
    });

    return NextResponse.json({
      success: true,
      data: savedRecord,
      message: 'Enquiry submitted successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          issues: error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        },
        { status: 400 }
      );
    }

    console.error('Server error processing enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing enquiry' },
      { status: 500 }
    );
  }
}
