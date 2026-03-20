import { clerkMiddleware } from '@clerk/nextjs/server';

// All routes are public by default.
// Auth state is read client-side; /history shows a soft sign-in prompt
// for unauthenticated users rather than a hard redirect.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
