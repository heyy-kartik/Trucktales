import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";



export default function Page() {
  
  
  return (
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignIn path="/sign-in" />
          </ClerkLoaded>
          <ClerkLoading>            
            <Loader2 className=" animate-spin text-muted-foreground "/>
          </ClerkLoading>
        </div>
  );
}