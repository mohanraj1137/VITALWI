'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bell, Check, Pill, Sparkles } from 'lucide-react';
import { mockMedications, mockPatient } from '@/lib/mock-data';
import type { Medication } from '@/lib/types';
import { aiMedicationReminderAndNotification } from '@/ai/flows/ai-medication-reminder-and-notification-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface Reminder {
  medicationId: string;
  patientMessage: string;
  relativeMessage: string | null;
  type: 'reminder' | 'missed';
}

export default function MedicationCard({ className }: { className?: string }) {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 15000); // Check every 15 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkMedications = async () => {
      for (const med of medications) {
        if (med.isTaken) continue;

        const reminderExists = reminders.some(r => r.medicationId === med.id);
        if (reminderExists) continue;

        const isDoseOverdue = currentTime > med.nextDoseTimestamp;

        if (isDoseOverdue) {
          setIsLoading((prev) => ({ ...prev, [med.id]: true }));
          try {
            const result = await aiMedicationReminderAndNotification({
              patientName: mockPatient.name,
              medicationName: med.name,
              dosage: med.dosage,
              scheduleDescription: med.scheduleDescription,
              lastTakenTimestampMs: med.lastTakenTimestamp,
              nextScheduledDoseTimestampMs: med.nextDoseTimestamp,
              currentTimestampMs: currentTime,
              relativeName: 'Arthur Vance',
              relativeRelationship: 'Son',
            });

            const newReminder: Reminder = {
              medicationId: med.id,
              patientMessage: result.patientReminderMessage,
              relativeMessage: result.relativeNotificationMessage,
              type: result.relativeNotificationMessage ? 'missed' : 'reminder',
            };

            setReminders((prev) => [...prev, newReminder]);

            toast({
              title: result.relativeNotificationMessage ? "Missed Dose Alert!" : "Medication Reminder",
              description: `Check the medication card for details on ${med.name}.`,
              variant: result.relativeNotificationMessage ? 'destructive' : 'default',
            });

          } catch (error) {
            console.error("AI flow error:", error);
          } finally {
            setIsLoading((prev) => ({ ...prev, [med.id]: false }));
          }
        }
      }
    };

    checkMedications();
  }, [currentTime, medications, reminders, toast]);

  const handleMarkAsTaken = (medicationId: string) => {
    setMedications(meds =>
      meds.map(med =>
        med.id === medicationId ? { ...med, isTaken: true } : med
      )
    );
    setReminders(rems => rems.filter(rem => rem.medicationId !== medicationId));
    toast({
      title: 'Medication Taken',
      description: 'Great job staying on schedule!',
    });
  };

  const sortedMedications = [...medications].sort((a, b) => a.nextDoseTimestamp - b.nextDoseTimestamp);

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle>Medication Schedule</CardTitle>
        <CardDescription>Upcoming doses and AI-powered reminders.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible className="w-full">
          {sortedMedications.map((med) => {
            const reminder = reminders.find(r => r.medicationId === med.id);
            const isTakenToday = med.isTaken;
            const isDue = currentTime > med.nextDoseTimestamp && !isTakenToday;

            return (
              <AccordionItem value={med.id} key={med.id}>
                <AccordionTrigger>
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="flex items-center gap-3 text-left">
                      <Pill className={cn("h-5 w-5 shrink-0", isTakenToday ? "text-green-500" : isDue ? "text-accent" : "text-muted-foreground")} />
                      <div>
                        <p className="font-semibold">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isTakenToday ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" /> Taken
                        </Badge>
                      ) : (
                        <Badge variant={isDue ? 'destructive' : 'outline'}>
                          Due {new Date(med.nextDoseTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {isLoading[med.id] && <Skeleton className="h-20 w-full" />}
                  {reminder && (
                    <div className={cn("rounded-lg border p-4", reminder.type === 'missed' ? 'border-destructive bg-destructive/10' : 'border-primary bg-primary/10')}>
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <h4 className="font-semibold">AI Reminder</h4>
                          <p className="text-sm text-foreground/80">{reminder.patientMessage}</p>
                        </div>
                      </div>
                      {reminder.relativeMessage && (
                        <div className="mt-3 flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/20 p-3">
                          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                          <div>
                            <h4 className="font-semibold text-destructive">Relative Notified</h4>
                            <p className="text-sm text-destructive/80">{reminder.relativeMessage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {!isTakenToday && (
                    <Button onClick={() => handleMarkAsTaken(med.id)} className="w-full">
                      <Check className="mr-2 h-4 w-4" /> Mark as Taken
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
