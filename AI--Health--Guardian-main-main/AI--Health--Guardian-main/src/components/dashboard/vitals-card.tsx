'use client';

import { useState, useEffect, useMemo } from 'react';
import { Activity, Droplets, HeartPulse } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { initialVitals, type Vitals } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type VitalDataPoint = {
  time: string;
  heartRate: number;
};

const CHART_POINTS = 20;

const generateInitialData = (): VitalDataPoint[] => {
  const data: VitalDataPoint[] = [];
  const now = new Date();
  for (let i = CHART_POINTS - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      heartRate: initialVitals.heartRate + Math.round((Math.random() - 0.5) * 4),
    });
  }
  return data;
};

const chartConfig = {
  heartRate: {
    label: 'Heart Rate',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function VitalsCard({ className }: { className?: string }) {
  const [vitals, setVitals] = useState<Vitals>(initialVitals);
  const [chartData, setChartData] = useState<VitalDataPoint[]>(generateInitialData());

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((prev) => {
        const newHeartRate = Math.round(
          prev.heartRate + (Math.random() - 0.5) * 2
        );
        return {
          heartRate: newHeartRate,
          pulse: newHeartRate + Math.round((Math.random() - 0.5) * 2), // Pulse is often similar to heart rate
          bloodPressure: {
            systolic: Math.round(
              prev.bloodPressure.systolic + (Math.random() - 0.5) * 3
            ),
            diastolic: Math.round(
              prev.bloodPressure.diastolic + (Math.random() - 0.5) * 2
            ),
          },
        };
      });

      setChartData((prev) => {
        const now = new Date();
        const newDataPoint = {
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          heartRate: vitals.heartRate,
        };
        const newChartData = [...prev.slice(1), newDataPoint];
        return newChartData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [vitals.heartRate]);
  
  const formattedVitals = useMemo(() => [
    {
      name: 'Heart Rate',
      value: `${vitals.heartRate}`,
      unit: 'BPM',
      icon: HeartPulse,
      color: 'text-red-500',
    },
    {
      name: 'Pulse',
      value: `${vitals.pulse}`,
      unit: 'BPM',
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      name: 'Blood Pressure',
      value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
      unit: 'mmHg',
      icon: Droplets,
      color: 'text-green-500',
    },
  ], [vitals]);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Live Vitals</CardTitle>
        <CardDescription>Real-time health monitoring.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          {formattedVitals.map((vital) => (
            <div key={vital.name} className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", 
                vital.name === 'Heart Rate' ? 'bg-red-100 dark:bg-red-900/30' : 
                vital.name === 'Pulse' ? 'bg-blue-100 dark:bg-blue-900/30' : 
                'bg-green-100 dark:bg-green-900/30'
              )}>
                <vital.icon className={cn("h-6 w-6", vital.color)} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{vital.name}</p>
                <p className="text-xl font-bold">
                  {vital.value}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">{vital.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Heart Rate (last 100s)</h3>
          <ChartContainer config={chartConfig} className="h-[120px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickCount={5} />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                dataKey="heartRate"
                type="monotone"
                stroke="var(--color-heartRate)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Vitals are updated every 5 seconds.</p>
      </CardFooter>
    </Card>
  );
}
