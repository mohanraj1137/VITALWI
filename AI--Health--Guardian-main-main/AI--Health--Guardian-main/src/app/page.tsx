'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/dashboard/header';
import VitalsCard from '@/components/dashboard/vitals-card';
import MovementCard from '@/components/dashboard/movement-card';
import MedicationCard from '@/components/dashboard/medication-card';
import RelativesCard from '@/components/dashboard/relatives-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Video, Stethoscope, CalendarPlus, HeartPulse, Activity,
  Users, Clock, ArrowRight, TrendingUp, Shield, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            {/* Quick Action Banner */}
            <div className="grid gap-4 md:grid-cols-4">
              <Link href="/consultations" className="group">
                <Card className="h-full overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1">
                  <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                      <Video className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Video Consult</p>
                      <p className="text-xs text-muted-foreground">Connect with a doctor</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/doctors" className="group">
                <Card className="h-full overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1">
                  <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-600" />
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-600/20">
                      <Stethoscope className="h-6 w-6 text-teal-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Find Doctor</p>
                      <p className="text-xs text-muted-foreground">Browse specialists</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-teal-400 transition-colors" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/vitals" className="group">
                <Card className="h-full overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1">
                  <div className="h-1 bg-gradient-to-r from-rose-500 to-pink-600" />
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-600/20">
                      <HeartPulse className="h-6 w-6 text-rose-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Health Data</p>
                      <p className="text-xs text-muted-foreground">Real-time vitals</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-rose-400 transition-colors" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile" className="group">
                <Card className="h-full overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1">
                  <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20">
                      <Shield className="h-6 w-6 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">My Profile</p>
                      <p className="text-xs text-muted-foreground">Health information</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-violet-400 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Featured Doctors Banner */}
            <Card className="overflow-hidden border-border/50">
              <div className="relative bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-indigo-600/10 p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-cyan-400" />
                    <div>
                      <h3 className="font-bold text-lg">Consult Top Specialists</h3>
                      <p className="text-sm text-muted-foreground">
                        6+ verified doctors available for telemedicine consultations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-3">
                      {['DrChen', 'DrWebb', 'DrKim', 'DrPatel', 'DrLee'].map((seed) => (
                        <Avatar key={seed} className="h-10 w-10 border-2 border-card ring-1 ring-primary/10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}`} />
                          <AvatarFallback className="text-xs bg-primary/20">Dr</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                      <Link href="/doctors">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Dashboard Grid */}
            <div className="grid auto-rows-max gap-6 md:grid-cols-2 lg:grid-cols-3">
              <VitalsCard className="lg:col-span-2" />
              <MovementCard className="lg:col-span-1" />
              <MedicationCard className="lg:col-span-2" />
              <RelativesCard className="lg:col-span-1" />
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Active Doctors', value: '6+', color: 'text-cyan-400', bg: 'from-cyan-500/10 to-blue-500/10' },
                { icon: Video, label: 'Consultation Types', value: '3', color: 'text-emerald-400', bg: 'from-emerald-500/10 to-green-500/10' },
                { icon: HeartPulse, label: 'Vitals Tracked', value: '7+', color: 'text-rose-400', bg: 'from-rose-500/10 to-pink-500/10' },
                { icon: TrendingUp, label: 'Health Score', value: '68', color: 'text-amber-400', bg: 'from-amber-500/10 to-orange-500/10' },
              ].map(stat => (
                <Card key={stat.label} className="border-border/50">
                  <CardContent className={`p-4 bg-gradient-to-br ${stat.bg} rounded-lg`}>
                    <stat.icon className={`h-8 w-8 ${stat.color} mb-2`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
