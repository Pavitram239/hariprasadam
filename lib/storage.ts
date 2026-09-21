import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { Enquiry, EnquiryStatus } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Local fallback storage path for development/offline mode
const localDataDir = path.join(process.cwd(), 'data');
const localDataFile = path.join(localDataDir, 'enquiries.json');

function ensureLocalFile() {
  if (!fs.existsSync(localDataDir)) {
    fs.mkdirSync(localDataDir, { recursive: true });
  }
  if (!fs.existsSync(localDataFile)) {
    // Seed with a sample enquiry so admin dashboard is demonstrably functional on first load
    const initialData: Enquiry[] = [
      {
        id: 'seed-01',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        name: 'Rajesh Mehta',
        phone: '+91 98250 12345',
        email: 'rajesh.mehta@diamondcorp.in',
        company: 'Mehta Diamond Exports',
        enquiry_type: 'Corporate Gifting',
        quantity: '250 Boxes',
        message: 'Looking for 250 units of Gift Box 03 (6 Jar Premium Nuts & Treats) for Diwali corporate client gifting with custom logo ribbon.',
        source_page: '/gifting',
        product_name: 'Gift Box 03 - Premium Nuts & Treats',
        status: 'New',
      },
      {
        id: 'seed-02',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        name: 'Pooja Shah',
        phone: '+91 99798 87654',
        email: 'pooja.shah@gmail.com',
        company: '',
        enquiry_type: 'Customization',
        quantity: '100 Boxes',
        message: 'Need customized Jain dry fruit boxes for wedding welcome hampers. Interested in Honey Rose and Cheese & Herbs varieties.',
        source_page: '/products/almond-honey-rose',
        product_name: 'Almond Honey Rose',
        status: 'Contacted',
      }
    ];
    fs.writeFileSync(localDataFile, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readLocalEnquiries(): Enquiry[] {
  ensureLocalFile();
  try {
    const raw = fs.readFileSync(localDataFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local enquiries:', err);
    return [];
  }
}

function writeLocalEnquiries(enquiries: Enquiry[]) {
  ensureLocalFile();
  fs.writeFileSync(localDataFile, JSON.stringify(enquiries, null, 2), 'utf-8');
}

export async function insertEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'> & { status?: EnquiryStatus }): Promise<Enquiry> {
  const newRecord: Enquiry = {
    ...enquiry,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'enq-' + Date.now(),
    created_at: new Date().toISOString(),
    status: enquiry.status || 'New',
  };

  // If Supabase is configured, attempt write to Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([newRecord])
        .select()
        .single();
      
      if (!error && data) {
        return data as Enquiry;
      }
      console.warn('Supabase insert failed, persisting to local storage backup:', error?.message);
    } catch (err) {
      console.warn('Supabase exception, falling back to local file storage:', err);
    }
  }

  // Always store in local file storage as well for guaranteed persistence
  const current = readLocalEnquiries();
  const updated = [newRecord, ...current];
  writeLocalEnquiries(updated);
  return newRecord;
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Enquiry[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, reading local store:', err);
    }
  }

  return readLocalEnquiries();
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status })
        .eq('id', id);

      if (!error) {
        // Also update local copy
        const current = readLocalEnquiries();
        const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
        writeLocalEnquiries(updated);
        return true;
      }
    } catch (err) {
      console.warn('Supabase update failed, updating local copy:', err);
    }
  }

  const current = readLocalEnquiries();
  const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
  writeLocalEnquiries(updated);
  return true;
}
