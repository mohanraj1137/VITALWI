'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  HeartPulse, LayoutGrid, Pill, Settings, FileText,
  Video, UserCircle, Stethoscope, LogOut, LogIn, Calendar
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Badge } from '@/components/ui/badge';

const TelemedLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-bold text-lg">
    V
  </div>
);

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-5 py-4">
          <div>
            <h1 className="font-headline text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              VitalWise
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
              Telemedicine Platform
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={isActive('/')}>
                <Link href="/">
                  <LayoutGrid />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Doctors" isActive={isActive('/doctors')}>
                <Link href="/doctors">
                  <Stethoscope />
                  <span>Find Doctors</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Consultations" isActive={isActive('/consultations')}>
                <Link href="/consultations">
                  <Video />
                  <span>Consultations</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Health Monitoring */}
        <SidebarGroup>
          <SidebarGroupLabel>Health Monitoring</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Vitals" isActive={isActive('/vitals')}>
                <Link href="/vitals">
                  <HeartPulse />
                  <span>Vitals History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Medications" isActive={isActive('/medications')}>
                <Link href="/medications">
                  <Pill />
                  <span>Medications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Reports" isActive={isActive('/reports')}>
                <Link href="/reports">
                  <FileText />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {isAuthenticated ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Profile" isActive={isActive('/profile')}>
                  <Link href="/profile">
                    <UserCircle />
                    <span>My Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" isActive={isActive('/settings')}>
                  <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* User info */}
              <div className="mt-2 rounded-xl bg-muted/50 p-3 mx-2">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <Badge
                  className="mt-1 text-[10px] px-2 py-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30"
                  variant="outline"
                >
                  {user?.role === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
                </Badge>
              </div>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Login">
                <Link href="/auth">
                  <LogIn />
                  <span>Login / Register</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
