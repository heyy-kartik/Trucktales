import { ReactNode } from 'react';
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Truck, Clock, History, IndianRupee, Settings, Bell } from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: ReactNode;
};

export function DriverLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/driver-dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Available Requests', href: '#', icon: <Truck className="h-5 w-5" /> },
    { name: 'Active Trip', href: '#', icon: <Clock className="h-5 w-5" /> },
    { name: 'Trip History', href: '#', icon: <History className="h-5 w-5" /> },
    { name: 'Earnings', href: '#', icon: <IndianRupee className="h-5 w-5" /> },
    { name: 'Settings', href: '#', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <Link href="#" className="flex items-center px-12 py-4 gap-2">
            <div className="flex items-center text-gray-950 space-x-2">
              <Truck className="h-8 w-8" />
              <span className="font-mono text-xl font-bold">TruckTales</span>
            </div>
          </Link>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex items-baseline space-x-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {navigation.find(item => pathname === item.href)?.name || 'Dashboard'}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
              <div className="ml-4 flex items-center md:ml-6">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
