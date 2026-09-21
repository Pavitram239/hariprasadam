import { NextRequest, NextResponse } from 'next/server';
import { fetchEnquiries, updateEnquiryStatus } from '@/lib/storage';
import { EnquiryStatus } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const enquiries = await fetchEnquiries();
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error('Error fetching admin enquiries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const validStatuses: EnquiryStatus[] = ['New', 'Contacted', 'Quoted', 'Closed'];
    if (!id || !status || !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid id or status' }, { status: 400 });
    }

    const success = await updateEnquiryStatus(id, status);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}
