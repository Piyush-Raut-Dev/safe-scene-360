import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  ClipboardCheck,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { mockDashboardStats, mockUserPerformance, mockQuizAttempts } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!user) return null;

  const stats = mockDashboardStats;

  // Chart data
  const performanceData = mockUserPerformance.map(p => ({
    name: p.userName.split(' ')[0],
    quizScore: p.averageQuizScore,
    hazardAccuracy: p.averageHazardAccuracy,
  }));

  const quizResultsData = [
    { name: 'Passed', value: mockQuizAttempts.filter(a => a.passed).length, color: 'hsl(142, 76%, 36%)' },
    { name: 'Failed', value: mockQuizAttempts.filter(a => !a.passed).length, color: 'hsl(0, 84%, 60%)' },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor safety training performance and compliance across your team.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <div className="flex items-center gap-2">
                  <p className="font-display text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                  <span className="flex items-center text-xs text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    +2
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <ClipboardCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Quiz Score</p>
                <div className="flex items-center gap-2">
                  <p className="font-display text-2xl font-bold text-foreground">{stats.averageQuizScore}%</p>
                  <span className="flex items-center text-xs text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    +5%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Eye className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hazard Accuracy</p>
                <div className="flex items-center gap-2">
                  <p className="font-display text-2xl font-bold text-foreground">{stats.averageHazardAccuracy}%</p>
                  <span className="flex items-center text-xs text-destructive">
                    <ArrowDownRight className="h-3 w-3" />
                    -2%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Assessments</p>
                <p className="font-display text-2xl font-bold text-foreground">{stats.pendingAssessments}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Performance Chart */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <TrendingUp className="h-5 w-5 text-primary" />
                User Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="quizScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Quiz Score" />
                    <Bar dataKey="hazardAccuracy" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Hazard Accuracy" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Results Pie Chart */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Quiz Pass Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={quizResultsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {quizResultsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display text-3xl font-bold">
                    {Math.round((quizResultsData[0].value / (quizResultsData[0].value + quizResultsData[1].value)) * 100)}%
                  </span>
                  <span className="text-sm text-muted-foreground">Pass Rate</span>
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-6">
                {quizResultsData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Performance Table */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Users className="h-5 w-5 text-primary" />
              Staff Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">User</th>
                    <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Quiz Attempts</th>
                    <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Avg Quiz Score</th>
                    <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Hazard Accuracy</th>
                    <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Trend</th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockUserPerformance.map((perf) => (
                    <tr key={perf.userId} className="hover:bg-muted/50">
                      <td className="py-4">
                        <p className="font-medium">{perf.userName}</p>
                      </td>
                      <td className="py-4 text-center">{perf.quizAttempts}</td>
                      <td className="py-4 text-center">
                        <span className={`font-semibold ${
                          perf.averageQuizScore >= 80 ? 'text-success' : 
                          perf.averageQuizScore >= 60 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {perf.averageQuizScore}%
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`font-semibold ${
                          perf.averageHazardAccuracy >= 80 ? 'text-success' : 
                          perf.averageHazardAccuracy >= 60 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {perf.averageHazardAccuracy}%
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          perf.trend === 'improving' ? 'bg-success/10 text-success' :
                          perf.trend === 'stable' ? 'bg-muted text-muted-foreground' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {perf.trend === 'improving' && <ArrowUpRight className="h-3 w-3" />}
                          {perf.trend === 'declining' && <ArrowDownRight className="h-3 w-3" />}
                          {perf.trend}
                        </span>
                      </td>
                      <td className="py-4 text-right text-sm text-muted-foreground">
                        {perf.lastActivity.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
