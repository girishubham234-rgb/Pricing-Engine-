import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector, Legend } from 'recharts';
import { generateBatchStrategySummary } from '../services/geminiService';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const mockMonthlyData = [
  { name: 'Week 1', revenue: 12000, users: 400 },
  { name: 'Week 2', revenue: 19000, users: 700 },
  { name: 'Week 3', revenue: 24000, users: 1100 },
  { name: 'Week 4', revenue: 32000, users: 1600 },
];

const mockDiscountDistribution = [
  { name: '0%', value: 400 },
  { name: '45%', value: 300 },
  { name: '65%', value: 300 },
  { name: '70%', value: 200 },
  { name: '75%', value: 100 },
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs font-medium">{`${value} Users`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(Rate: ${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg z-50">
        <p className="text-slate-700 font-bold mb-2 text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></div>
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold text-slate-800">
              {entry.name.includes('Revenue') ? `₹${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const [aiSummary, setAiSummary] = useState("Generating AI insights...");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Generate a static summary on load for the demo effect
    const fetchSummary = async () => {
      const summary = await generateBatchStrategySummary({
        conversionRate: 18.5,
        revenueUplift: 24.2,
        aov: 17.0
      });
      setAiSummary(summary);
    };
    fetchSummary();
  }, []);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Executive Dashboard</h2>
          <p className="text-slate-500 mt-1">Real-time performance of the Pricing Engine</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-blue-700 text-sm font-medium flex items-center">
          <Activity size={16} className="mr-2" />
          System Status: Active & Optimizing
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-hover hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Users className="text-indigo-600" size={24} />
            </div>
            <span className="text-green-500 flex items-center text-sm font-semibold">
              +12.5% <ArrowUpRight size={14} className="ml-1" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Active Users</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">12,450</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-hover hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <TrendingUp className="text-emerald-600" size={24} />
            </div>
            <span className="text-green-500 flex items-center text-sm font-semibold">
              +18.2% <ArrowUpRight size={14} className="ml-1" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Conversion Rate</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">8.4%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-hover hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <span className="text-green-500 flex items-center text-sm font-semibold">
              +17.0% <ArrowUpRight size={14} className="ml-1" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Avg Order Value</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">₹1,240</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-hover hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Activity className="text-orange-600" size={24} />
            </div>
            <span className="text-red-500 flex items-center text-sm font-semibold">
              -4.2% <ArrowUpRight size={14} className="ml-1 rotate-90" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Churn Rate</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">2.1%</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue & User Growth (30 Days)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis yAxisId="left" orientation="left" stroke="#4F46E5" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748B" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                <Bar yAxisId="right" dataKey="users" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Distribution */}
        <div className="space-y-6">
          {/* AI Insight Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Activity size={64} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                 <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-bold uppercase border border-blue-500/30">Gemini Powered</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Strategic Insight</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {aiSummary}
              </p>
              <button className="text-xs font-semibold text-blue-300 hover:text-white transition-colors">
                View Full Analysis &rarr;
              </button>
            </div>
          </div>

          {/* Discount Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Discount Distribution</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={mockDiscountDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {mockDiscountDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};