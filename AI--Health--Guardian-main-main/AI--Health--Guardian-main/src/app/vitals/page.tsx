'use client';

import { useMemo } from 'react';
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
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  heartRate: {
    label: 'Heart Rate',
    color: 'hsl(var(--chart-1))',
  },
  systolic: {
    label: 'Systolic',
    color: 'hsl(var(--chart-2))',
  },
  diastolic: {
    label: 'Diastolic',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function VitalsPage() {
  const vitalsHistoryData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        heartRate: 70 + Math.floor(Math.random() * 15) - 5,
        systolic: 115 + Math.floor(Math.random() * 10) - 5,
        diastolic: 75 + Math.floor(Math.random() * 8) - 4,
      };
    });
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <Header />
          <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate History</CardTitle>
                <CardDescription>
                  Your heart rate history over the last 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <LineChart
                    data={vitalsHistoryData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <Tooltip
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Legend />
                    <Line
                      dataKey="heartRate"
                      type="monotone"
                      stroke="var(--color-heartRate)"
                      strokeWidth={2}
                      dot={false}
                      name="Heart Rate (BPM)"
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure History</CardTitle>
                <CardDescription>
                  Your blood pressure history over the last 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <LineChart
                    data={vitalsHistoryData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <Tooltip
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Legend />
                    <Line
                      dataKey="systolic"
                      type="monotone"
                      stroke="var(--color-systolic)"
                      strokeWidth={2}
                      dot={false}
                      name="Systolic (mmHg)"
                    />
                    <Line
                      dataKey="diastolic"
                      type="monotone"
                      stroke="var(--color-diastolic)"
                      strokeWidth={2}
                      dot={false}
                      name="Diastolic (mmHg)"
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
