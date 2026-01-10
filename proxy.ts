import { authMiddleware, clerkClient, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
]);

export default authMiddleware({
  publicRoutes,

  async afterAuth(auth, req) {

    // 🚫 Not logged in & protected route
    if (!auth.userId && !publicRoutes(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId);
      const role = user.publicMetadata.role as "shipper" | "Driver" | undefined;
      console.log("User Role:", role);
      if (!role) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }

      // 🚫 BLOCK "/" AFTER LOGIN
      if (req.nextUrl.pathname === "/") {
        return NextResponse.redirect(
          new URL(
            role === "shipper" ? "/shipper-dashboard" : "/driver-dashboard",
            req.url
          )
        );
      }

      // 🚫 Role-based access
      if (role === "Driver" && req.nextUrl.pathname.startsWith("/shipper-dashboard")) {
        return NextResponse.redirect(new URL("/driver-dashboard", req.url));
      }

      if (role === "shipper" && req.nextUrl.pathname.startsWith("/driver-dashboard")) {
        return NextResponse.redirect(new URL("/shipper-dashboard", req.url));
      }

      // 🔁 Logged-in users should not see auth pages
      if (publicRoutes(req) && req.nextUrl.pathname !== "/") {
        return NextResponse.redirect(
          new URL(
            role === "shipper" ? "/shipper-dashboard" : "/driver-dashboard",
            req.url
          )
        );
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};