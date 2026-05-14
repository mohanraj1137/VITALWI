'use client';

import { useState } from 'react';
import { AlertTriangle, User, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function MovementCard({ className }: { className?: string }) {
  const [fallDetected, setFallDetected] = useState(false);
  const [movementStatus, setMovementStatus] = useState('Normal');

  const triggerFall = () => {
    setFallDetected(true);
    setMovementStatus('Fall Detected');
  };

  const resetStatus = () => {
    setFallDetected(false);
    setMovementStatus('Normal');
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Movement Analysis</CardTitle>
        <CardDescription>Movement and fall detection status.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6 text-center">
        {fallDetected ? (
          <Alert variant="destructive" className="text-left">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Emergency: Fall Detected!</AlertTitle>
            <AlertDescription>
              A fall has been detected at {new Date().toLocaleTimeString()}. Relatives have been notified automatically. Please check on the patient immediately.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <User className="h-16 w-16 text-primary" />
            <p className="text-2xl font-bold">Normal</p>
            <p className="text-muted-foreground">No unusual activity detected.</p>
          </div>
        )}

        <div className="flex w-full gap-2">
          {fallDetected ? (
            <Button onClick={resetStatus} className="w-full">
              Reset Status
            </Button>
          ) : (
            <Button onClick={triggerFall} variant="outline" className="w-full">
              <UserX className="mr-2 h-4 w-4" />
              Simulate Fall
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
