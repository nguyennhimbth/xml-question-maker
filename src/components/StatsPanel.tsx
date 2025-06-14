
import React from 'react';
import { useQuestions } from '@/context/QuestionsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Target, Folder, TrendingUp } from 'lucide-react';

const StatsPanel = () => {
  const { fastestFingerQuestions, regularQuestions } = useQuestions();

  // Calculate basic stats
  const totalQuestions = fastestFingerQuestions.length + regularQuestions.length;
  const totalFastestFinger = fastestFingerQuestions.length;
  const totalRegular = regularQuestions.length;

  // Calculate categories
  const categories = [...new Set(regularQuestions.map(q => q.category).filter(Boolean))];
  const categoryStats = categories.map(category => ({
    name: category,
    count: regularQuestions.filter(q => q.category === category).length
  }));

  // Calculate difficulty stats for all questions
  const allQuestions = [...fastestFingerQuestions, ...regularQuestions];
  const easyCount = allQuestions.filter(q => q.difficulty === 1).length;
  const mediumCount = allQuestions.filter(q => q.difficulty === 2).length;
  const hardCount = allQuestions.filter(q => q.difficulty === 3).length;

  // Data for charts
  const questionTypeData = [
    { name: 'Fastest Finger', count: totalFastestFinger, color: '#8884d8' },
    { name: 'Regular Questions', count: totalRegular, color: '#82ca9d' }
  ];

  const difficultyData = [
    { name: 'Easy', count: easyCount, color: '#22c55e' },
    { name: 'Medium', count: mediumCount, color: '#eab308' },
    { name: 'Hard', count: hardCount, color: '#ef4444' }
  ];

  // Calculate difficulty breakdown for regular questions only
  const regularEasyCount = regularQuestions.filter(q => q.difficulty === 1).length;
  const regularMediumCount = regularQuestions.filter(q => q.difficulty === 2).length;
  const regularHardCount = regularQuestions.filter(q => q.difficulty === 3).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Easy Questions</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{easyCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Questions</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mediumCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hard Questions</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{hardCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Question Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={questionTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Difficulty Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Difficulty Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Categories Breakdown */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Fastest Finger Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-semibold">{totalFastestFinger}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected for Export:</span>
                <span className="font-semibold">
                  {fastestFingerQuestions.filter(q => q.selected).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Regular Questions by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-600">Easy:</span>
                <span className="font-semibold">{regularEasyCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Medium:</span>
                <span className="font-semibold">{regularMediumCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Hard:</span>
                <span className="font-semibold">{regularHardCount}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Selected for Export:</span>
                <span className="font-semibold">
                  {regularQuestions.filter(q => q.selected).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsPanel;
