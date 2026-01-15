import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Calendar,
  Users,
  ClipboardCheck,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';

const reportTypes = [
  {
    id: 'performance',
    title: 'User Performance Summary',
    description: 'Individual scores, quiz history, and hazard identification accuracy per user.',
    icon: Users,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'training',
    title: 'Training Completion Status',
    description: 'Overview of completed, in-progress, and pending training modules.',
    icon: ClipboardCheck,
    color: 'bg-success/10 text-success',
  },
  {
    id: 'hazards',
    title: 'Risk Areas Analysis',
    description: 'Commonly missed hazards and areas requiring additional training focus.',
    icon: AlertTriangle,
    color: 'bg-accent/10 text-accent',
  },
  {
    id: 'compliance',
    title: 'Compliance Report',
    description: 'Full safety compliance documentation for audits and inspections.',
    icon: FileText,
    color: 'bg-warning/10 text-warning',
  },
];

const AdminReports = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleGenerateReport = async (reportId: string, format: 'pdf' | 'csv') => {
    setGenerating(`${reportId}-${format}`);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGenerating(null);
    toast.success('Report generated!', {
      description: `Your ${format.toUpperCase()} report is ready for download.`,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Reports & Analytics
            </h1>
            <p className="mt-1 text-muted-foreground">
              Generate safety compliance and performance reports
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {reportTypes.map((report) => (
            <Card key={report.id} className="card-elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${report.color}`}>
                      <report.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="font-display">{report.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleGenerateReport(report.id, 'pdf')}
                    disabled={generating !== null}
                  >
                    {generating === `${report.id}-pdf` ? (
                      <span className="animate-pulse">Generating...</span>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleGenerateReport(report.id, 'csv')}
                    disabled={generating !== null}
                  >
                    {generating === `${report.id}-csv` ? (
                      <span className="animate-pulse">Generating...</span>
                    ) : (
                      <>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Download CSV
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats Preview */}
        <Card className="card-elevated mt-8">
          <CardHeader>
            <CardTitle className="font-display">Report Preview</CardTitle>
            <CardDescription>
              Quick summary of key metrics for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Total Assessments</p>
                <p className="font-display text-2xl font-bold">47</p>
                <p className="text-xs text-success">+12% from previous period</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="font-display text-2xl font-bold">86.7%</p>
                <p className="text-xs text-success">+5% from previous period</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="font-display text-2xl font-bold">92%</p>
                <p className="text-xs text-success">+3% from previous period</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Hazards Identified</p>
                <p className="font-display text-2xl font-bold">234</p>
                <p className="text-xs text-muted-foreground">Across all scenes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download All */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            variant="accent"
            onClick={() => {
              toast.success('Generating comprehensive report...', {
                description: 'This may take a few moments.',
              });
            }}
          >
            <Download className="mr-2 h-5 w-5" />
            Download All Reports (ZIP)
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminReports;
