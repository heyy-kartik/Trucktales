import { currentUser } from "@clerk/nextjs/server";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function Page() {
  const user = await currentUser();

  const userData = user
    ? {
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.username ||
          "User",
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl || "",
      }
    : {
        name: "Guest",
        email: "guest@example.com",
        avatar: "",
      };

  return (
    <SidebarProvider defaultOpen={true} className="">
      <div className="flex h-screen w-screen overflow-hidden relative bg-background text-foreground">
        <SidebarInset>
          <SiteHeader />
          <div className="flex h-full w-full flex-1 overflow-hidden px-4 pb-4 md:px-6 md:pb-6">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
