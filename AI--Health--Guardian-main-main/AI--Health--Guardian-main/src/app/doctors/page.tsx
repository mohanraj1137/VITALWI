'use client';

import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Search, MapPin, Clock, Video, Phone, MessageSquare, Sparkles, CalendarPlus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  specialty: string;
  hospital: string;
  yearsExperience: number;
  rating: number;
  consultationFee: number;
  availableDays: string[];
  bio: string;
  isOnline: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export default function DoctorsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, [specialty]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (specialty && specialty !== 'all') params.append('specialty', specialty);
      if (search) params.append('search', search);

      const res = await fetch(`${BACKEND_URL}/api/doctors-db?${params}`);
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      // Fallback to sample data
      setDoctors(sampleDoctors);
    }
    setIsLoading(false);
  };

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
    doc.hospital.toLowerCase().includes(search.toLowerCase())
  );

  const specialties = ['all', ...new Set(doctors.map(d => d.specialty))];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 md:p-8 text-white">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%221.5%22%20fill%3D%22rgba(255%2C255%2C255%2C0.05)%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Find Your Doctor</h2>
                <p className="text-blue-100 mb-4 max-w-lg">
                  Browse our network of certified specialists and book a telemedicine consultation in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search doctors, specialties, hospitals..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20"
                    />
                  </div>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map(s => (
                        <SelectItem key={s} value={s}>
                          {s === 'all' ? 'All Specialties' : s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Doctor Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 rounded bg-muted" />
                          <div className="h-3 w-1/2 rounded bg-muted" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredDoctors.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-xl font-semibold">No doctors found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredDoctors.map((doctor) => (
                  <Card key={doctor._id || doctor.email} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                            <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xl">
                              {doctor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {doctor.isOnline && (
                            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-card animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">{doctor.name}</h3>
                          <Badge variant="secondary" className="mb-1 bg-primary/10 text-primary border-0">
                            {doctor.specialty}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{doctor.hospital}</span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>

                      <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4 fill-amber-400" />
                          <span className="font-semibold">{doctor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{doctor.yearsExperience} yrs experience</span>
                        </div>
                        <span className="font-bold text-primary">${doctor.consultationFee}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {doctor.availableDays?.slice(0, 3).map(day => (
                          <Badge key={day} variant="outline" className="text-xs px-2 py-0">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                        {(doctor.availableDays?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            +{doctor.availableDays.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-sm"
                          onClick={() => {
                            if (!isAuthenticated) {
                              router.push('/auth');
                            } else {
                              router.push(`/consultations?book=${doctor._id || doctor.email}`);
                            }
                          }}
                        >
                          <CalendarPlus className="mr-1 h-3.5 w-3.5" />
                          Book Consult
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Video className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Fallback sample data if backend is unavailable
const sampleDoctors: Doctor[] = [
  {
    _id: 'doc-1',
    name: 'Dr. Isabella Chen',
    email: 'dr.chen@telemedhealth.com',
    phone: '+1 (555) 987-6543',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrChen',
    specialty: 'Cardiology',
    hospital: 'Springfield Heart Center',
    yearsExperience: 18,
    rating: 4.9,
    consultationFee: 150,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Board-certified cardiologist with 18 years of experience. Specializing in preventive cardiology.',
    isOnline: true,
  },
  {
    _id: 'doc-2',
    name: 'Dr. Marcus Webb',
    email: 'dr.webb@telemedhealth.com',
    phone: '+1 (555) 456-7890',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrWebb',
    specialty: 'Endocrinology',
    hospital: 'Springfield General Hospital',
    yearsExperience: 14,
    rating: 4.7,
    consultationFee: 120,
    availableDays: ['Tuesday', 'Thursday'],
    bio: 'Experienced endocrinologist specializing in diabetes management and thyroid disorders.',
    isOnline: true,
  },
  {
    _id: 'doc-3',
    name: 'Dr. Sarah Kim',
    email: 'dr.kim@telemedhealth.com',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrKim',
    specialty: 'Rheumatology',
    hospital: 'Miami Medical Center',
    yearsExperience: 12,
    rating: 4.8,
    consultationFee: 130,
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    bio: 'Compassionate rheumatologist focused on autoimmune diseases and patient-centered care.',
    isOnline: false,
  },
  {
    _id: 'doc-4',
    name: 'Dr. Amara Patel',
    email: 'dr.patel@telemedhealth.com',
    phone: '+1 (555) 678-9012',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrPatel',
    specialty: 'Psychiatry',
    hospital: 'MindWell Institute',
    yearsExperience: 16,
    rating: 4.9,
    consultationFee: 175,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    bio: 'Board-certified psychiatrist offering telepsychiatry. Expert in anxiety, depression, and CBT.',
    isOnline: true,
  },
  {
    _id: 'doc-5',
    name: 'Dr. Robert Lee',
    email: 'dr.lee@telemedhealth.com',
    phone: '+1 (555) 789-0123',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrLee',
    specialty: 'General Medicine',
    hospital: 'HealthFirst Clinic',
    yearsExperience: 20,
    rating: 4.8,
    consultationFee: 80,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    bio: 'Family medicine physician with 20 years of experience. Passionate about primary care and prevention.',
    isOnline: true,
  },
  {
    _id: 'doc-6',
    name: 'Dr. James Rodriguez',
    email: 'dr.rodriguez@telemedhealth.com',
    phone: '+1 (555) 567-8901',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=DrRodriguez',
    specialty: 'Dermatology',
    hospital: 'City Skin Clinic',
    yearsExperience: 10,
    rating: 4.6,
    consultationFee: 100,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Dermatologist specializing in teledermatology, skin cancer screening, and cosmetic dermatology.',
    isOnline: true,
  },
];
