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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockMedications } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Pill, CheckCircle, Clock } from 'lucide-react';

export default function MedicationsPage() {
  const now = new Date().getTime();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Card>
              <CardHeader>
                <CardTitle>Medication Management</CardTitle>
                <CardDescription>
                  View and manage your complete medication schedule.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Next Dose</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMedications.map((med) => {
                      const isDue = now > med.nextDoseTimestamp && !med.isTaken;
                      const isTaken = med.isTaken;

                      return (
                        <TableRow key={med.id}>
                          <TableCell className="flex items-center gap-2 font-medium">
                            <Pill className="h-5 w-5 text-primary" />
                            {med.name}
                          </TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.scheduleDescription}</TableCell>
                          <TableCell>
                            {new Date(med.nextDoseTimestamp).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            {isTaken ? (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Taken
                              </Badge>
                            ) : isDue ? (
                              <Badge variant="destructive">
                                <Clock className="mr-1 h-3 w-3" />
                                Overdue
                              </Badge>
                            ) : (
                              <Badge variant="outline">Upcoming</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
