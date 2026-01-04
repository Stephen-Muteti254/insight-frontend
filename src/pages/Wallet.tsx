import { useState } from 'react';
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

const transactions = [
  { id: 1, type: 'earning', title: 'Consumer Habits Survey', amount: 2.50, date: '2024-01-28', status: 'paid' },
  { id: 2, type: 'earning', title: 'Technology Usage Study', amount: 3.75, date: '2024-01-27', status: 'paid' },
  { id: 3, type: 'withdrawal', title: 'PayPal Withdrawal', amount: -20.00, date: '2024-01-25', status: 'paid' },
  { id: 4, type: 'earning', title: 'Shopping Preferences', amount: 1.25, date: '2024-01-24', status: 'pending' },
];

export default function Wallet() {
  const { user, updateUser } = useAuth();
  const [paypalEmail, setPaypalEmail] = useState(user?.paypalEmail || '');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const canWithdraw = (user?.balance || 0) >= 5;

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!paypalEmail || !amount || amount < 5 || amount > (user?.balance || 0)) {
      toast({ title: "Invalid withdrawal", description: "Check amount and PayPal email.", variant: "destructive" });
      return;
    }

    setIsWithdrawing(true);
    await new Promise(r => setTimeout(r, 1500));
    
    updateUser({ balance: (user?.balance || 0) - amount, paypalEmail });
    toast({ title: "Withdrawal requested!", description: "Processing within 1 business day." });
    setDialogOpen(false);
    setWithdrawAmount('');
    setIsWithdrawing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Balance Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-3xl font-bold">${user?.balance?.toFixed(2)}</p>
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
              {!canWithdraw && <p className="text-xs text-muted-foreground mt-2 text-center">Min. $5.00 required</p>}
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
              <p className="text-xs text-muted-foreground mt-4">Pending earnings become available within 24-48 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tx.type === 'earning' ? 'bg-accent/10' : 'bg-muted'}`}>
                      {tx.type === 'earning' ? <CheckCircle className="h-4 w-4 text-accent" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.title}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
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
      </div>
    </DashboardLayout>
  );
}
