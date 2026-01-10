import { authMiddleware, clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const publicRoutes = ["/", "/api/webhook/register", "/sign-up", "/sign-in"];

export default authMiddleware({
  publicRoutes,

  async afterAuth(auth, req) {
    //handle unauth userws trying to access protected routes
    if (!auth.userId && !publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if(auth.userId){

  try{
    const user = await clerkClient.users.getUser(auth.userId);
    const role = user.publicMetadata.role as string | undefined;
    

    if(role === "shipper" && req.nextUrl.pathname === "/shippper-dashboard" ){
      return NextResponse.redirect(new URL('/', req.url));
    }

    if(role === "driver" && req.nextUrl.pathname === "/dashboard" ){
      return NextResponse.redirect(new URL('/', req.url));
      }
      if(publicRoutes.includes(req.nextUrl.pathname)){
      if(auth.userId){
        const user = await clerkClient.users.getUser(auth.userId);
        const role = user.publicMetadata.role as string | undefined;

        if(role === "shipper"){
          return NextResponse.redirect(new URL('/shippper-dashboard', req.url));
        }

        if(role === "driver"){
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      }
    }
    }

    
    catch(err){
      console.error("Error fetching user data from Clerk:", err);
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

    

    return NextResponse.next();
  },
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}