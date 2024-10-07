import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const studentData = request.cookies.get('studentData')?.value; // Check for studentData cookie

    // Define paths that should be protected
    const protectedPaths = ['/', '/manage-task']; // Add other protected paths as needed
    const publicPaths = ['/login', '/register']; // Paths accessible to all

    const isProtectedPath = protectedPaths.includes(request.nextUrl.pathname);
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    // If the user tries to access a protected path without the studentData cookie
    if (isProtectedPath && !studentData) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If the user is logged in (cookie exists) and tries to access public paths
    if (studentData && isPublicPath) {
        // Redirect to the home page or another page
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next(); // Allow access
}

// This is a Next.js middleware configuration
export const config = {
    matcher: ['/', '/login', '/register', '/manage-task'], // Define routes to which middleware should apply
};
