'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/dashboard/header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { mockPatient, mockRelatives } from '@/lib/mock-data';

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <Header />
          <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <Card>
              <CardHeader>
                <CardTitle>Patient Profile</CardTitle>
                <CardDescription>
                  Manage your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={mockPatient.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" defaultValue="1950-05-24" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  How you'd like to receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="email-notifications" className="cursor-pointer">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders and alerts via email.
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="sms-notifications" className="cursor-pointer">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive critical alerts on your mobile phone.
                    </p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>
                  Manage who gets notified in an emergency.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRelatives.map((relative) => (
                  <div
                    key={relative.name}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{relative.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {relative.relationship}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
                <Button className="w-full">Add New Contact</Button>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
