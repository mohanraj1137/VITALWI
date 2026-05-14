'use client';

import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  User, Mail, Phone, MapPin, Heart, Shield, Activity,
  Calendar, Droplets, AlertTriangle, Save, Edit, Loader2,
  Stethoscope, Star
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [gender, setGender] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/auth');
      return;
    }
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setBloodType(user.bloodType || '');
      setGender(user.gender || '');
      setAllergies((user.allergies || []).join(', '));
      setConditions((user.chronicConditions || []).join(', '));
      setEmergencyName(user.emergencyContact?.name || '');
      setEmergencyRelation(user.emergencyContact?.relationship || '');
      setEmergencyPhone(user.emergencyContact?.phone || '');
      setBio((user as any).bio || '');
    }
  }, [user, isAuthenticated, authLoading]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({
      name,
      phone,
      address,
      bloodType,
      gender,
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: conditions.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: { name: emergencyName, relationship: emergencyRelation, phone: emergencyPhone },
      bio,
    } as any);

    setSaving(false);
    if (result.success) {
      toast({ title: '✅ Profile Updated', description: 'Your profile has been saved successfully.' });
      setEditing(false);
    } else {
      toast({ title: 'Update Failed', description: result.message, variant: 'destructive' });
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            {/* Profile Header */}
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700" />
              <CardContent className="relative pb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
                  <Avatar className="h-24 w-24 ring-4 ring-card shadow-xl">
                    <AvatarImage src={user.avatarUrl || `https://api.dicebear.com/7.x/personas/svg?seed=${user.name}`} />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
                        {user.role === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
                      </Badge>
                      {user.role === 'doctor' && user.specialty && (
                        <Badge variant="secondary">{user.specialty}</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Mail className="h-3.5 w-3.5" /> {user.email}
                      {user.phone && <><span>•</span> <Phone className="h-3.5 w-3.5" /> {user.phone}</>}
                    </p>
                  </div>
                  <Button
                    onClick={() => editing ? handleSave() : setEditing(true)}
                    disabled={saving}
                    className={editing
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                    }
                  >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                      editing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                    {editing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      {editing ? (
                        <Input value={name} onChange={e => setName(e.target.value)} />
                      ) : (
                        <p className="text-sm font-medium p-2 rounded-lg bg-muted/50">{name || '—'}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      {editing ? (
                        <Input value={gender} onChange={e => setGender(e.target.value)} placeholder="Male / Female / Other" />
                      ) : (
                        <p className="text-sm font-medium p-2 rounded-lg bg-muted/50">{gender || '—'}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone</Label>
                    {editing ? (
                      <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
                    ) : (
                      <p className="text-sm font-medium p-2 rounded-lg bg-muted/50">{phone || '—'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Address</Label>
                    {editing ? (
                      <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, City, State" />
                    ) : (
                      <p className="text-sm font-medium p-2 rounded-lg bg-muted/50">{address || '—'}</p>
                    )}
                  </div>
                  {user.role === 'doctor' && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5" /> Bio</Label>
                      {editing ? (
                        <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell patients about yourself..." />
                      ) : (
                        <p className="text-sm font-medium p-2 rounded-lg bg-muted/50">{bio || '—'}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Health Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Health Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5 text-red-500" /> Blood Type</Label>
                    {editing ? (
                      <Input value={bloodType} onChange={e => setBloodType(e.target.value)} placeholder="A+, B-, O+, etc." />
                    ) : (
                      <p className="text-sm font-medium p-2 rounded-lg bg-muted/50">{bloodType || '—'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Allergies</Label>
                    {editing ? (
                      <Input value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="Penicillin, Shellfish..." />
                    ) : (
                      <div className="flex flex-wrap gap-1 p-2">
                        {allergies ? allergies.split(',').map(a => a.trim()).filter(Boolean).map(a => (
                          <Badge key={a} variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">{a}</Badge>
                        )) : <span className="text-muted-foreground text-sm">None listed</span>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1"><Activity className="h-3.5 w-3.5 text-blue-500" /> Chronic Conditions</Label>
                    {editing ? (
                      <Input value={conditions} onChange={e => setConditions(e.target.value)} placeholder="Hypertension, Diabetes..." />
                    ) : (
                      <div className="flex flex-wrap gap-1 p-2">
                        {conditions ? conditions.split(',').map(c => c.trim()).filter(Boolean).map(c => (
                          <Badge key={c} variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">{c}</Badge>
                        )) : <span className="text-muted-foreground text-sm">None listed</span>}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-500" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Contact Name</Label>
                      {editing ? (
                        <Input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Jane Doe" />
                      ) : (
                        <p className="text-sm font-medium p-2 rounded-lg bg-muted/50">{emergencyName || '—'}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      {editing ? (
                        <Input value={emergencyRelation} onChange={e => setEmergencyRelation(e.target.value)} placeholder="Spouse, Parent, etc." />
                      ) : (
                        <p className="text-sm font-medium p-2 rounded-lg bg-muted/50">{emergencyRelation || '—'}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      {editing ? (
                        <Input value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                      ) : (
                        <p className="text-sm font-medium p-2 rounded-lg bg-muted/50">{emergencyPhone || '—'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
