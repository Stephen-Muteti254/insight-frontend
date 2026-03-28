import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState<any>({
    availableBalance: 0,
    pendingBalance: 0,
    recentEarnings: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardApi.getDashboard();
        setDashboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalEarnings =
  dashboard.availableBalance + dashboard.pendingBalance;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold">{user?.name?.split(' ')[0]}</h1>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <Card key={i}>
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-accent">
                  ${dashboard.availableBalance.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  ${dashboard.pendingBalance.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">
                  ${totalEarnings.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {dashboard.recentEarnings.length}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Earnings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/wallet">View All</Link>
            </Button>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard.recentEarnings.map((earning: any) => (
                  <div key={earning.id} className="flex justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">{earning.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(earning.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={earning.status}>
                        {earning.status}
                      </Badge>
                      <span className="font-semibold text-accent">
                        +${earning.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
