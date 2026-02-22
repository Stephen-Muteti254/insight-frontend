import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, CheckCircle, XCircle, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  paypalEmail: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: Date;
  processedAt?: Date;
}

// Mock data for demonstration
const mockWithdrawals: Withdrawal[] = [
  {
    id: 'w1',
    userId: 'u1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    paypalEmail: 'john.paypal@example.com',
    amount: 25.00,
    status: 'pending',
    requestedAt: new Date('2024-01-22'),
  },
  {
    id: 'w2',
    userId: 'u2',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    paypalEmail: 'sarah@paypal.com',
    amount: 50.00,
    status: 'pending',
    requestedAt: new Date('2024-01-21'),
  },
  {
    id: 'w3',
    userId: 'u3',
    userName: 'Mike Davis',
    userEmail: 'mike@example.com',
    paypalEmail: 'mike.d@paypal.com',
    amount: 100.00,
    status: 'paid',
    requestedAt: new Date('2024-01-18'),
    processedAt: new Date('2024-01-19'),
  },
  {
    id: 'w4',
    userId: 'u4',
    userName: 'Emily Brown',
    userEmail: 'emily@example.com',
    paypalEmail: 'emily.b@paypal.com',
    amount: 15.00,
    status: 'rejected',
    requestedAt: new Date('2024-01-17'),
    processedAt: new Date('2024-01-18'),
  },
];

export default function Withdrawals() {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'markPaid' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchesSearch =
      w.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.paypalEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async () => {
    if (!selectedWithdrawal || !confirmAction) return;

    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let newStatus: Withdrawal['status'];
    let toastMessage: string;

    switch (confirmAction) {
      case 'approve':
        newStatus = 'approved';
        toastMessage = `Withdrawal of $${selectedWithdrawal.amount} approved`;
        break;
      case 'reject':
        newStatus = 'rejected';
        toastMessage = `Withdrawal of $${selectedWithdrawal.amount} rejected`;
        break;
      case 'markPaid':
        newStatus = 'paid';
        toastMessage = `Withdrawal of $${selectedWithdrawal.amount} marked as paid`;
        break;
      default:
        return;
    }

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === selectedWithdrawal.id
          ? { ...w, status: newStatus, processedAt: new Date() }
          : w
      )
    );

    toast({
      title: confirmAction === 'reject' ? 'Withdrawal Rejected' : 'Withdrawal Processed',
      description: toastMessage,
      variant: confirmAction === 'reject' ? 'destructive' : 'default',
    });

    setIsProcessing(false);
    setConfirmDialogOpen(false);
    setSelectedWithdrawal(null);
    setConfirmAction(null);
  };

  const openConfirmDialog = (withdrawal: Withdrawal, action: 'approve' | 'reject' | 'markPaid') => {
    setSelectedWithdrawal(withdrawal);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const getStatusBadge = (status: Withdrawal['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'paid':
        return (
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <DollarSign className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  const pendingCount = withdrawals.filter((w) => w.status === 'pending').length;
  const approvedCount = withdrawals.filter((w) => w.status === 'approved').length;
  const totalPending = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved (Unpaid)</p>
                  <p className="text-2xl font-bold text-blue-500">{approvedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                  <p className="text-2xl font-bold text-yellow-500">${totalPending.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or PayPal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>PayPal</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No withdrawal requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{withdrawal.userName}</p>
                          <p className="text-sm text-muted-foreground">{withdrawal.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{withdrawal.paypalEmail}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-accent">${withdrawal.amount.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>{format(withdrawal.requestedAt, 'MMM d, yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {withdrawal.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openConfirmDialog(withdrawal, 'reject')}
                                className="text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openConfirmDialog(withdrawal, 'approve')}
                                className="text-accent hover:text-accent"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {withdrawal.status === 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmDialog(withdrawal, 'markPaid')}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'approve' && 'Approve Withdrawal'}
              {confirmAction === 'reject' && 'Reject Withdrawal'}
              {confirmAction === 'markPaid' && 'Mark as Paid'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'approve' &&
                `Are you sure you want to approve this withdrawal of $${selectedWithdrawal?.amount.toFixed(2)} to ${selectedWithdrawal?.paypalEmail}?`}
              {confirmAction === 'reject' &&
                `Are you sure you want to reject this withdrawal request? The user will be notified.`}
              {confirmAction === 'markPaid' &&
                `Confirm that you have sent $${selectedWithdrawal?.amount.toFixed(2)} to ${selectedWithdrawal?.paypalEmail} via PayPal.`}
            </DialogDescription>
          </DialogHeader>

          {selectedWithdrawal && (
            <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">User</span>
                <span className="text-sm font-medium">{selectedWithdrawal.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">PayPal</span>
                <span className="text-sm font-medium">{selectedWithdrawal.paypalEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-bold text-accent">${selectedWithdrawal.amount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant={confirmAction === 'reject' ? 'destructive' : 'default'}
              onClick={handleAction}
              disabled={isProcessing}
              className={confirmAction !== 'reject' ? 'bg-accent hover:bg-accent/90' : ''}
            >
              {isProcessing ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
