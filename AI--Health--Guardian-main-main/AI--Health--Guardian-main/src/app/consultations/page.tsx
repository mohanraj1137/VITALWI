'use client';

import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Video, Phone, MessageSquare, Calendar, Clock, CheckCircle2,
  XCircle, Play, CalendarPlus, Stethoscope, ArrowRight, Loader2
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

interface Consultation {
  _id: string;
  patient: { _id: string; name: string; avatarUrl: string };
  doctor: { _id: string; name: string; avatarUrl: string; specialty: string; hospital: string };
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  reason: string;
  symptoms: string[];
  diagnosis: string;
  prescription: string;
  roomId: string;
}

export default function ConsultationsPage() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking form
  const [bookDoctor, setBookDoctor] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');
  const [bookType, setBookType] = useState('video');
  const [bookReason, setBookReason] = useState('');
  const [bookSymptoms, setBookSymptoms] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    fetchConsultations();
    fetchDoctors();
  }, [isAuthenticated]);

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/consultations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setConsultations(data.data);
      }
    } catch {
      // Use sample data
      setConsultations(sampleConsultations);
    }
    setIsLoading(false);
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/doctors-db`);
      const data = await res.json();
      if (data.success) setDoctors(data.data);
    } catch {
      setDoctors([]);
    }
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: bookDoctor,
          scheduledDate: bookDate,
          scheduledTime: bookTime,
          type: bookType,
          reason: bookReason,
          symptoms: bookSymptoms.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: '✅ Consultation Booked!', description: 'Your appointment has been scheduled.' });
        setBookingOpen(false);
        fetchConsultations();
        // Reset form
        setBookDoctor(''); setBookDate(''); setBookTime('');
        setBookReason(''); setBookSymptoms('');
      } else {
        toast({ title: 'Booking Failed', description: data.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to book consultation.', variant: 'destructive' });
    }
    setBookingLoading(false);
  };

  const handleStartConsultation = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/api/consultations/${id}/start`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast({ title: '🏥 Consultation Started', description: 'Joining consultation room...' });
      fetchConsultations();
    } catch {
      toast({ title: 'Error', description: 'Failed to start consultation.', variant: 'destructive' });
    }
  };

  const handleCancelConsultation = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/api/consultations/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: 'Cancelled by user' })
      });
      toast({ title: 'Consultation Cancelled', description: 'The consultation has been cancelled.' });
      fetchConsultations();
    } catch {
      toast({ title: 'Error', description: 'Failed to cancel.', variant: 'destructive' });
    }
  };

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    'scheduled': { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Calendar, label: 'Scheduled' },
    'in-progress': { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: Play, label: 'In Progress' },
    'completed': { color: 'bg-slate-500/10 text-slate-600 border-slate-500/20', icon: CheckCircle2, label: 'Completed' },
    'cancelled': { color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: XCircle, label: 'Cancelled' },
  };

  const typeIcons: Record<string, any> = { video: Video, audio: Phone, chat: MessageSquare };

  const upcoming = consultations.filter(c => c.status === 'scheduled' || c.status === 'in-progress');
  const past = consultations.filter(c => c.status === 'completed' || c.status === 'cancelled');

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">Consultations</h2>
                <p className="text-muted-foreground">Manage your telemedicine appointments</p>
              </div>
              <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/20">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Book Consultation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Book a Consultation
                    </DialogTitle>
                    <DialogDescription>
                      Schedule a telemedicine consultation with a specialist
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBookConsultation} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Doctor</Label>
                      <Select value={bookDoctor} onValueChange={setBookDoctor} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a doctor..." />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map(doc => (
                            <SelectItem key={doc._id} value={doc._id}>
                              {doc.name} - {doc.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input type="time" value={bookTime} onChange={e => setBookTime(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Consultation Type</Label>
                      <Select value={bookType} onValueChange={setBookType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">📹 Video Call</SelectItem>
                          <SelectItem value="audio">📞 Audio Call</SelectItem>
                          <SelectItem value="chat">💬 Chat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Visit</Label>
                      <Textarea placeholder="Describe your symptoms or the reason for your visit..." value={bookReason} onChange={e => setBookReason(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Symptoms (comma-separated)</Label>
                      <Input placeholder="headache, fatigue, dizziness..." value={bookSymptoms} onChange={e => setBookSymptoms(e.target.value)} />
                    </div>
                    <Button type="submit" disabled={bookingLoading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600">
                      {bookingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarPlus className="mr-2 h-4 w-4" />}
                      Confirm Booking
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total', value: consultations.length, color: 'from-blue-500 to-indigo-600' },
                { label: 'Upcoming', value: upcoming.length, color: 'from-cyan-500 to-blue-600' },
                { label: 'Completed', value: past.filter(c => c.status === 'completed').length, color: 'from-emerald-500 to-green-600' },
                { label: 'Cancelled', value: past.filter(c => c.status === 'cancelled').length, color: 'from-rose-500 to-red-600' },
              ].map(stat => (
                <Card key={stat.label} className="overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
                  <CardContent className="p-4">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Consultations Tabs */}
            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">
                  Upcoming ({upcoming.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({past.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-4 space-y-4">
                {upcoming.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-xl font-semibold mb-1">No upcoming consultations</h3>
                    <p className="text-muted-foreground mb-4">Book a consultation with a specialist to get started</p>
                    <Button onClick={() => setBookingOpen(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Book Now
                    </Button>
                  </Card>
                ) : (
                  upcoming.map(consultation => {
                    const config = statusConfig[consultation.status];
                    const TypeIcon = typeIcons[consultation.type] || Video;
                    const person = user?.role === 'patient' ? consultation.doctor : consultation.patient;

                    return (
                      <Card key={consultation._id} className="group transition-all duration-300 hover:shadow-lg border-border/50">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                                <AvatarImage src={person?.avatarUrl} />
                                <AvatarFallback>{person?.name?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <h4 className="font-bold">{person?.name || 'Unknown'}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {user?.role === 'patient' && consultation.doctor?.specialty}
                                  {consultation.reason && ` • ${consultation.reason}`}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(consultation.scheduledDate).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {consultation.scheduledTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TypeIcon className="h-3 w-3" />
                                    {consultation.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={config.color}>
                                <config.icon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                              {consultation.status === 'scheduled' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-emerald-500 to-green-600"
                                    onClick={() => handleStartConsultation(consultation._id)}
                                  >
                                    <Play className="mr-1 h-3 w-3" /> Join
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => handleCancelConsultation(consultation._id)}
                                  >
                                    <XCircle className="mr-1 h-3 w-3" /> Cancel
                                  </Button>
                                </>
                              )}
                              {consultation.status === 'in-progress' && (
                                <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse">
                                  <Video className="mr-1 h-3.5 w-3.5" /> Rejoin
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-4 space-y-4">
                {past.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-xl font-semibold mb-1">No past consultations</h3>
                    <p className="text-muted-foreground">Your completed consultations will appear here</p>
                  </Card>
                ) : (
                  past.map(consultation => {
                    const config = statusConfig[consultation.status];
                    const person = user?.role === 'patient' ? consultation.doctor : consultation.patient;

                    return (
                      <Card key={consultation._id} className="border-border/50">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={person?.avatarUrl} />
                                <AvatarFallback>{person?.name?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{person?.name || 'Unknown'}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(consultation.scheduledDate).toLocaleDateString()} at {consultation.scheduledTime}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={config.color}>
                                <config.icon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                              {consultation.diagnosis && (
                                <Badge variant="secondary" className="text-xs">Has Diagnosis</Badge>
                              )}
                            </div>
                          </div>
                          {consultation.diagnosis && (
                            <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm">
                              <p><strong>Diagnosis:</strong> {consultation.diagnosis}</p>
                              {consultation.prescription && <p className="mt-1"><strong>Prescription:</strong> {consultation.prescription}</p>}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const sampleConsultations: Consultation[] = [];
