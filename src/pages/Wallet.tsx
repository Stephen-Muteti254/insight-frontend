import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Wallet as WalletIcon, ArrowUpRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { walletApi } from '@/lib/wallet.api';
import { Skeleton } from '@/components/ui/skeleton';

export default function Wallet() {
  const { user, updateUser } = useAuth();
  const [paypalEmail, setPaypalEmail] = useState(user?.paypalEmail || '');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [wallet, setWallet] = useState<any>(null);
  const [wallet, setWallet] = useState<any>({
    availableBalance: 0,
    pendingBalance: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(true);

  // const canWithdraw = (user?.balance || 0) >= 5;
  const canWithdraw = (wallet?.availableBalance || 0) >= 0.1;

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await walletApi.getWallet();
        setWallet(data);

        // sync with auth context
        updateUser({
          availableBalance: data.availableBalance,
          pendingBalance: data.pendingBalance,
        });

      } catch (err) {
        toast({ title: "Error", description: "Failed to load wallet", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    if (!paypalEmail || !amount || amount < 5 || amount > (wallet?.availableBalance || 0)) {
      toast({
        title: "Invalid withdrawal",
        description: "Check amount and PayPal email.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsWithdrawing(true);

      await walletApi.withdraw({ amount, paypalEmail });

      const refreshed = await walletApi.getWallet();
      setWallet(refreshed);

      updateUser({
        availableBalance: refreshed.availableBalance,
        pendingBalance: refreshed.pendingBalance,
      });

      toast({
        title: "Withdrawal requested!",
        description: "Processing within 1 business day."
      });

      setDialogOpen(false);
      setWithdrawAmount('');

    } catch (err) {
      toast({
        title: "Error",
        description: "Withdrawal failed",
        variant: "destructive"
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Balance Cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-3xl font-bold">${wallet?.availableBalance?.toFixed(2) || "0.00"}</p>
                </div>
                <WalletIcon className="h-10 w-10 text-primary opacity-50" />
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="mt-4 w-full" disabled={!canWithdraw}>
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>Withdrawals are processed within 1 business day via PayPal.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>PayPal Email</Label>
                      <Input value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} placeholder="your@paypal.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount (min $5.00)</Label>
                      <Input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="5.00" />
                      <p className="text-xs text-muted-foreground">Available: ${user?.balance?.toFixed(2)}</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="hero" onClick={handleWithdraw} disabled={isWithdrawing}>
                      {isWithdrawing ? 'Processing...' : 'Confirm Withdrawal'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/*{!canWithdraw && <p className="text-xs text-muted-foreground mt-2 text-center">Min. $5.00 required</p>}*/}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Balance</p>
                  <p className="text-3xl font-bold text-warning">${user?.pendingBalance?.toFixed(2)}</p>
                </div>
                <Clock className="h-10 w-10 text-warning opacity-50" />
              </div>
              {/*<p className="text-xs text-muted-foreground mt-4">Pending earnings become available within 24-48 hours</p>*/}
            </CardContent>
          </Card>
        </div>
        )}

        {/* Transaction History */}
        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
              {wallet?.transactions?.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tx.type === 'earning' ? 'bg-accent/10' : 'bg-muted'}`}>
                      {tx.type === 'earning' ? <CheckCircle className="h-4 w-4 text-accent" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.amount > 0 ? 'text-accent' : ''}`}>
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <Badge variant={tx.status as 'paid' | 'pending'}>{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
