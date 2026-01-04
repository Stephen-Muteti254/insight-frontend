import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Bell, Mail, Shield, User } from 'lucide-react';

export default function Settings() {
  const { user, updateUser } = useAuth();

  const handleNotificationChange = (checked: boolean) => {
    updateUser({ notifyOnSurveys: checked });
    toast({ title: checked ? "Notifications enabled" : "Notifications disabled" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle>
            <CardDescription>Manage how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>New Survey Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when new surveys are available</p>
              </div>
              <Switch checked={user?.notifyOnSurveys} onCheckedChange={handleNotificationChange} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Payment Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your withdrawals</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
