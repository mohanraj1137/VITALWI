'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeartPulse, Shield, Video, Stethoscope, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('patient');
  const [regPhone, setRegPhone] = useState('');

  if (isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(loginEmail, loginPassword);
    setIsLoading(false);
    if (result.success) {
      toast({ title: '✅ Welcome back!', description: 'You have been logged in successfully.' });
      router.push('/');
    } else {
      toast({ title: 'Login Failed', description: result.message, variant: 'destructive' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      phone: regPhone,
    });
    setIsLoading(false);
    if (result.success) {
      toast({ title: '🎉 Account Created!', description: 'Welcome to VitalWise.' });
      router.push('/');
    } else {
      toast({ title: 'Registration Failed', description: result.message, variant: 'destructive' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0c4a6e]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-1/4 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Branding */}
          <div className="flex flex-col justify-center text-white">
              <div className="flex h-12 items-center">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  VitalWise
                </h1>
              </div>

            <h2 className="mb-4 text-4xl font-bold leading-tight lg:text-5xl">
              Healthcare at your
              <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                fingertips
              </span>
            </h2>
            <p className="mb-8 text-lg text-slate-300/80 leading-relaxed">
              Connect with certified doctors through video, audio, or chat consultations. 
              Monitor your health in real-time and get personalized care from anywhere.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                <div>
                  <p className="font-semibold text-sm">Video Consult</p>
                  <p className="text-xs text-slate-400">Face-to-face care</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                <div>
                  <p className="font-semibold text-sm">Secure Data</p>
                  <p className="text-xs text-slate-400">End-to-end encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                <div>
                  <p className="font-semibold text-sm">Expert Doctors</p>
                  <p className="text-xs text-slate-400">Certified specialists</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Auth Card */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20">
              <Tabs defaultValue="login" className="w-full">
                <CardHeader className="pb-2">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="login" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-400">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-400">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                {/* Login Tab */}
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 pt-4">
                      <CardTitle className="text-xl text-white">Welcome Back</CardTitle>
                      <CardDescription className="text-slate-400">
                        Sign in to access your telemedicine dashboard
                      </CardDescription>
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 transition-all duration-300"
                      >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                        Sign In
                      </Button>
                      <div className="rounded-lg bg-white/5 p-3 text-xs text-slate-400 border border-white/10">
                        <p className="font-semibold text-slate-300 mb-1">Demo Credentials:</p>
                        <p>Patient: eleanor@example.com / patient123</p>
                        <p>Doctor: dr.chen@telemedhealth.com / doctor123</p>
                      </div>
                    </CardContent>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="mt-0">
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4 pt-4">
                      <CardTitle className="text-xl text-white">Create Account</CardTitle>
                      <CardDescription className="text-slate-400">
                        Join VitalWise for virtual consultations
                      </CardDescription>
                      <div className="space-y-2">
                        <Label htmlFor="reg-name" className="text-slate-300">Full Name</Label>
                        <Input
                          id="reg-name"
                          type="text"
                          placeholder="John Doe"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          required
                          className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email" className="text-slate-300">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="your@email.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          required
                          className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password" className="text-slate-300">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Min 6 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          minLength={6}
                          className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Role</Label>
                          <Select value={regRole} onValueChange={setRegRole}>
                            <SelectTrigger className="border-white/10 bg-white/5 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="patient">Patient</SelectItem>
                              <SelectItem value="doctor">Doctor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-phone" className="text-slate-300">Phone</Label>
                          <Input
                            id="reg-phone"
                            type="tel"
                            placeholder="+1 555..."
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25"
                      >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                        Create Account
                      </Button>
                    </CardContent>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
