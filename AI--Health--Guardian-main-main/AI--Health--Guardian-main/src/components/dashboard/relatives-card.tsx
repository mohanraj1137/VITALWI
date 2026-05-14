import { Mail, Phone, User, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockRelatives } from '@/lib/mock-data';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function RelativesCard({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>
          Your designated relatives and caregivers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockRelatives.map((relative) => (
            <li
              key={relative.name}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{relative.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{relative.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {relative.relationship}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <a href={`tel:${relative.phone}`} aria-label={`Call ${relative.name}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`mailto:${relative.email}`} aria-label={`Email ${relative.name}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button variant="outline" className="mt-6 w-full">
          <Users className="mr-2 h-4 w-4" />
          Manage Contacts
        </Button>
      </CardContent>
    </Card>
  );
}
