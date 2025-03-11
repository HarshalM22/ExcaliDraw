"use server"
import { cookies } from 'next/headers';

export async function getCookies() {
  const cookie = await cookies();
  return cookie.get("next-auth.session-token")?.value ;
}