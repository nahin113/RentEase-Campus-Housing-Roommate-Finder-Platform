import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50/50 text-gray-950 font-sans">
        <AppSidebar />
        <main className="flex-1 w-full flex flex-col overflow-x-hidden">
          <div className="flex items-center gap-4 p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <SidebarTrigger className="hover:bg-gray-100 rounded-full" />
            <div className="h-4 w-[1px] bg-gray-200" />
            <span className="text-xs font-medium text-gray-400">Workspace / Dashboard</span>
          </div>
          <div className="p-6 md:p-10 max-w-[1600px] w-full mx-auto flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}