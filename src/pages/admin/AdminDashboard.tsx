import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';

// Mock stats for demonstration
const stats = {
  pendingApplications: 12,
  pendingWithdrawals: 8,
  activeSurveys: 24,
  totalUsers: 1250,
  totalPaidOut: 45678.50,
  completedSurveys: 3420,
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Admin Overview</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Applications
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.pendingApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires review</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Withdrawals
              </CardTitle>
              <CreditCard className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.pendingWithdrawals}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Surveys
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.activeSurveys}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Paid Out
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">${stats.totalPaidOut.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">To all users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Surveys
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedSurveys.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/applications"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Review Applications</p>
                  <p className="text-sm text-muted-foreground">{stats.pendingApplications} pending</p>
                </div>
              </a>
              <a
                href="/admin/withdrawals"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium">Process Withdrawals</p>
                  <p className="text-sm text-muted-foreground">{stats.pendingWithdrawals} pending</p>
                </div>
              </a>
              <a
                href="/admin/surveys"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Manage Surveys</p>
                  <p className="text-sm text-muted-foreground">{stats.activeSurveys} active</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
