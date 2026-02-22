import { useState, useRef, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Upload,
  X,
  Eye,
  Clock,
  Users,
  DollarSign,
  File,
  Image,
  FileIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  createSurveyAdmin,
  deleteSurveyAdmin,
  getAllSurveysAdmin,
  updateSurveyAdmin
} from "@/lib/survey.api";

interface SurveyAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Survey {
  id: string;
  title: string;
  topic: string;
  description: string;
  durationMinutes: number;
  reward: number;
  totalSlots: number;
  slotsRemaining: number;
  externalUrl: string;
  isActive: boolean;
  attachments: SurveyAttachment[];
  createdAt: Date;
  expiresAt: Date;
}

// Mock data for demonstration
const mockSurveys: Survey[] = [
  {
    id: 's1',
    title: 'Consumer Shopping Habits 2024',
    topic: 'Consumer Research',
    description: 'Share your shopping preferences and habits for major retail brands',
    durationMinutes: 15,
    reward: 2.50,
    totalSlots: 500,
    slotsRemaining: 234,
    externalUrl: 'https://surveys.example.com/shop-2024',
    isActive: true,
    attachments: [
      { id: 'a1', name: 'Brand Guidelines.pdf', type: 'application/pdf', size: 1234567, url: '#' },
    ],
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-02-15'),
  },
  {
    id: 's2',
    title: 'Tech Product Feedback',
    topic: 'Technology',
    description: 'Evaluate new smartphone features and provide your feedback',
    durationMinutes: 20,
    reward: 4.00,
    totalSlots: 200,
    slotsRemaining: 89,
    externalUrl: 'https://surveys.example.com/tech-feedback',
    isActive: true,
    attachments: [
      { id: 'a2', name: 'Product Images.zip', type: 'application/zip', size: 5678901, url: '#' },
      { id: 'a3', name: 'Instructions.pdf', type: 'application/pdf', size: 234567, url: '#' },
    ],
    createdAt: new Date('2024-01-18'),
    expiresAt: new Date('2024-02-28'),
  },
  {
    id: 's3',
    title: 'Healthcare Experience Survey',
    topic: 'Healthcare',
    description: 'Share your experiences with telehealth services',
    durationMinutes: 10,
    reward: 1.75,
    totalSlots: 1000,
    slotsRemaining: 0,
    externalUrl: 'https://surveys.example.com/health-tele',
    isActive: false,
    attachments: [],
    createdAt: new Date('2024-01-10'),
    expiresAt: new Date('2024-01-25'),
  },
];

const topics = [
  'Consumer Research',
  'Technology',
  'Healthcare',
  'Finance',
  'Entertainment',
  'Education',
  'Lifestyle',
  'Other',
];

const initialFormState = {
  title: '',
  topic: '',
  description: '',
  durationMinutes: 10,
  reward: 1.00,
  totalSlots: 100,
  externalUrl: '',
  expiresAt: '',
  isActive: true,
};

export default function SurveyManagement() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getAllSurveysAdmin();
        setSurveys(
          data.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            expiresAt: s.expiresAt ? new Date(s.expiresAt) : null,
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);


  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && s.isActive && s.slotsRemaining > 0) ||
      (statusFilter === 'inactive' && (!s.isActive || s.slotsRemaining === 0));
    return matchesSearch && matchesStatus;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.topic || !formData.externalUrl) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
          fd.append(k, String(v));
        }
      });

      attachments.forEach((file) => {
        fd.append('attachments', file);
      });

      const createdSurvey = await createSurveyAdmin(fd);

      // Optional: if backend returns the created survey
      setSurveys((prev) => [
        {
          ...createdSurvey,
          createdAt: new Date(createdSurvey.createdAt),
          expiresAt: createdSurvey.expiresAt
            ? new Date(createdSurvey.expiresAt)
            : null,
        },
        ...prev,
      ]);

      toast({
        title: 'Survey Created',
        description: `"${formData.title}" has been created successfully.`,
      });

      setCreateDialogOpen(false);
      setFormData(initialFormState);
      setAttachments([]);
    } catch (err) {
      console.log(err);
      toast({
        title: 'Error',
        description: 'Failed to create survey. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };


  const handleEdit = async () => {
    if (!selectedSurvey) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSurveys((prev) =>
      prev.map((s) =>
        s.id === selectedSurvey.id
          ? {
              ...s,
              ...formData,
              expiresAt: new Date(formData.expiresAt || s.expiresAt),
            }
          : s
      )
    );

    toast({
      title: 'Survey Updated',
      description: `"${formData.title}" has been updated successfully.`,
    });

    setIsProcessing(false);
    setEditDialogOpen(false);
    setSelectedSurvey(null);
    setFormData(initialFormState);
  };

  const handleDelete = async () => {
    if (!selectedSurvey) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSurveys((prev) => prev.filter((s) => s.id !== selectedSurvey.id));

    toast({
      title: 'Survey Deleted',
      description: `"${selectedSurvey.title}" has been deleted.`,
      variant: 'destructive',
    });

    setIsProcessing(false);
    setDeleteDialogOpen(false);
    setSelectedSurvey(null);
  };

  const openEditDialog = (survey: Survey) => {
    setSelectedSurvey(survey);
    setFormData({
      title: survey.title,
      topic: survey.topic,
      description: survey.description,
      durationMinutes: survey.durationMinutes,
      reward: survey.reward,
      totalSlots: survey.totalSlots,
      externalUrl: survey.externalUrl,
      expiresAt: format(survey.expiresAt, 'yyyy-MM-dd'),
      isActive: survey.isActive,
    });
    setEditDialogOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  const activeSurveys = surveys.filter((s) => s.isActive && s.slotsRemaining > 0).length;
  const totalSlots = surveys.reduce((sum, s) => sum + s.slotsRemaining, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Survey Management</h1>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Survey
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Surveys</p>
                  <p className="text-2xl font-bold text-primary">{activeSurveys}</p>
                </div>
                <FileText className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Slots</p>
                  <p className="text-2xl font-bold">{totalSlots.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Surveys</p>
                  <p className="text-2xl font-bold">{surveys.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground/50" />
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
                  placeholder="Search surveys..."
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
                  <SelectItem value="all">All Surveys</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Surveys Table */}
        <Card>
          <CardHeader>
            <CardTitle>Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Survey</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Slots</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    ))
                  : filteredSurveys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No surveys found
                        </TableCell>
                      </TableRow>
                    ) : (
                  filteredSurveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{survey.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {survey.durationMinutes} min
                            {survey.attachments.length > 0 && (
                              <>
                                <span className="mx-1">•</span>
                                <File className="h-3 w-3" />
                                {survey.attachments.length} file{survey.attachments.length > 1 ? 's' : ''}
                              </>
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{survey.topic}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-accent">${survey.reward.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={survey.slotsRemaining === 0 ? 'text-muted-foreground' : ''}>
                          {survey.slotsRemaining}/{survey.totalSlots}
                        </span>
                      </TableCell>
                      <TableCell>
                        {survey.isActive && survey.slotsRemaining > 0 ? (
                          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(survey)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSurvey(survey);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Create Survey Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Survey</DialogTitle>
            <DialogDescription>
              Add a new survey for users to complete. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Survey title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Select
                  value={formData.topic}
                  onValueChange={(value) => setFormData({ ...formData, topic: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the survey..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalUrl">Survey URL *</Label>
              <Input
                id="externalUrl"
                placeholder="https://surveys.example.com/your-survey"
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              />
            </div>

            {/* Survey Parameters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward">Reward ($)</Label>
                <Input
                  id="reward"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slots">Total Slots</Label>
                <Input
                  id="slots"
                  type="number"
                  min={1}
                  value={formData.totalSlots}
                  onChange={(e) => setFormData({ ...formData, totalSlots: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expires">Expires</Label>
                <Input
                  id="expires"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>

            {/* File Attachments */}
            <div className="space-y-3">
              <Label>Attachments (optional)</Label>
              <p className="text-sm text-muted-foreground">
                Upload files that users should review before taking the survey
              </p>
              
              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip"
                />
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload files</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, XLS, Images, ZIP (max 10MB each)
                </p>
              </div>

              {/* Attached Files */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium">Active</p>
                <p className="text-sm text-muted-foreground">Survey will be visible to users immediately</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isProcessing}>
              {isProcessing ? 'Creating...' : 'Create Survey'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Survey Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Survey</DialogTitle>
            <DialogDescription>Update survey details and settings.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-topic">Topic</Label>
                <Select
                  value={formData.topic}
                  onValueChange={(value) => setFormData({ ...formData, topic: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-url">Survey URL</Label>
              <Input
                id="edit-url"
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Reward ($)</Label>
                <Input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Slots</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.totalSlots}
                  onChange={(e) => setFormData({ ...formData, totalSlots: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expires</Label>
                <Input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>

            {/* Existing Attachments */}
            {selectedSurvey && selectedSurvey.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Current Attachments</Label>
                <div className="space-y-2">
                  {selectedSurvey.attachments.map((att) => (
                    <div key={att.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(att.type)}
                        <div>
                          <p className="text-sm font-medium">{att.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(att.size)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={att.url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium">Active</p>
                <p className="text-sm text-muted-foreground">Survey visibility status</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isProcessing}>
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Survey</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedSurvey?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
              {isProcessing ? 'Deleting...' : 'Delete Survey'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
