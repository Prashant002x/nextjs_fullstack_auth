import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  // 1. Get the path the user is trying to access
  const path = request.nextUrl.pathname
 
  // 2. Define which paths are public
  // We check if the current path matches any of these specific strings
  const isPublicPath = path === '/login' || path === '/signup' || path === '/verify-email' || path==='/forgot-password' || path==='/reset-password'
 
  // 3. Get the token from cookies
  const token = request.cookies.get('token')?.value || ''
 
  // 4. Logic: If user is logged in (has token) and tries to go to Login/Signup...
  // Redirect them to home page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }
 
  // 5. Logic: If user is NOT logged in and tries to go to a protected page...
  // Redirect them to Login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
    
  // 6. Allow the request to proceed if no conditions matched
  return NextResponse.next()
}
 
// 7. Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verify-email',
    '/forgot-password',
    '/reset-password'
  ]
}