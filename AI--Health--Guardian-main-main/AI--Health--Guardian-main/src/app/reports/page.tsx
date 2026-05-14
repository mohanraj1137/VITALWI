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
import { Download } from 'lucide-react';

const reports = [
  {
    title: 'Weekly Health Summary',
    description:
      'A summary of your vitals, activity, and medication adherence for last week.',
    date: 'Generated on ' + new Date().toLocaleDateString(),
  },
  {
    title: 'Medication Adherence Report',
    description: 'Detailed log of your medication intake for the last 30 days.',
    date: 'Generated on ' + new Date().toLocaleDateString(),
  },
  {
    title: 'Vitals Trend Analysis',
    description:
      'Trends and patterns in your heart rate and blood pressure over the last 3 months.',
    date: 'Generated on ' + new Date().toLocaleDateString(),
  },
];

export default function ReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Reports</CardTitle>
                  <CardDescription>
                    Download your generated health reports.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reports.map((report) => (
                    <Card
                      key={report.title}
                      className="flex flex-col items-start justify-between p-4 sm:flex-row"
                    >
                      <div className="mb-4 flex-1 sm:mb-0">
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {report.date}
                        </p>
                      </div>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
