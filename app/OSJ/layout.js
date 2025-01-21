import Sidebar from "@/components/sidebar";
import { SidebarProvider } from "@/context/SidebarContext";

export default function OSJLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
