import { useState, useEffect } from "react";
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogPortal,
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
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
  getAllApplicationsAdminApi,
  approveApplicationAdminApi,
  rejectApplicationAdminApi,
} from "@/lib/application.admin";

interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'submitted' | 'approved' | 'rejected';
  submittedAt: Date;
  answers: {
    experience: string;
    motivation: string;
    availability: string;
    bio: string;
  };
}


export default function Applications() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);

      try {
        const data = await getAllApplicationsAdminApi();

        setApplications(
          data.map(app => ({
            ...app,
            submittedAt: new Date(app.submittedAt),
          }))
        );
      } catch (error) {
        toast({
          title: "Failed to load applications",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);


  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (application: Application) => {
    setIsProcessing(true);

    await approveApplicationAdminApi(application.id);

    setApplications(prev =>
      prev.map(app =>
        app.id === application.id ? { ...app, status: "approved" } : app
      )
    );

    toast({
      title: "Application Approved",
      description: `${application.userName}'s application has been approved.`,
    });

    setIsProcessing(false);
    setViewDialogOpen(false);
  };


  const handleReject = async () => {
    if (!selectedApplication) return;

    setIsProcessing(true);

    await rejectApplicationAdminApi(
      selectedApplication.id,
      rejectionReason
    );

    setApplications(prev =>
      prev.map(app =>
        app.id === selectedApplication.id ? { ...app, status: "rejected" } : app
      )
    );

    toast({
      title: "Application Rejected",
      variant: "destructive",
    });

    setIsProcessing(false);
    setRejectDialogOpen(false);
    setViewDialogOpen(false);
    setRejectionReason("");
  };


  const getStatusBadge = (status: Application['status']) => {
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
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
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

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">User Applications</h1>
            {/*<p className="text-muted-foreground mt-1">
              Review and manage user applications ({pendingCount} pending)
            </p>*/}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
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
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  ))}

                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{application.userName}</p>
                          <p className="text-sm text-muted-foreground">{application.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{format(application.submittedAt, 'MMM d, yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>     

      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="fixed max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the application submitted by {selectedApplication?.userName}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div>
                  <p className="font-medium">{selectedApplication.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedApplication.userEmail}</p>
                </div>
                {getStatusBadge(selectedApplication.status)}
              </div>

              {/* Application Answers */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience</label>
                  <p className="mt-1 p-3 bg-secondary/20 rounded-lg">{selectedApplication.answers.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Motivation</label>
                  <p className="mt-1 p-3 bg-secondary/20 rounded-lg">{selectedApplication.answers.motivation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Availability</label>
                  <p className="mt-1 p-3 bg-secondary/20 rounded-lg">{selectedApplication.answers.availability}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="mt-1 p-3 bg-secondary/20 rounded-lg">{selectedApplication.answers.bio}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Submitted on {format(selectedApplication.submittedAt, 'MMMM d, yyyy')}
              </p>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedApplication?.status === 'submitted' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setRejectDialogOpen(true)}
                  disabled={isProcessing}
                  className="text-destructive hover:text-destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedApplication)}
                  disabled={isProcessing}
                  className="bg-accent hover:bg-accent/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Approve'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rejection Reason (optional)</label>
              <Textarea
                placeholder="Provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
              {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
