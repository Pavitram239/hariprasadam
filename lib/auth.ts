import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { supabase } from './supabaseClient';

export const ADMIN_COOKIE_NAME = 'hp_admin_session';

export interface AdminSession {
  email: string;
  role: 'admin';
  loggedInAt: string;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value) as AdminSession;
    if (session && session.role === 'admin') {
      return session;
    }
  } catch (err) {
    return null;
  }

  return null;
}

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
  if (cookie && cookie.value) {
    try {
      const session = JSON.parse(cookie.value) as AdminSession;
      if (session && session.role === 'admin') {
        return true;
      }
    } catch {
      return false;
    }
  }

  // Also check Bearer authorization header if passed
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) return true;
      } catch {
        return false;
      }
    }
  }

  return false;
}
