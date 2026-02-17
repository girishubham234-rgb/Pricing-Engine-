import React, { useState, useEffect } from 'react';
import { UserProfile, BatchResult } from '../types';
import { analyzeUser } from '../services/pricingEngine';
import { CheckCircle, XCircle, Play, Loader2, Users } from 'lucide-react';

// Mock data generator
const generateMockUsers = (count: number): UserProfile[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `U${(i + 1).toString().padStart(3, '0')}`,
    name: `User ${i + 1}`,
    mockTestsTaken: Math.floor(Math.random() * 5),
    addedToCart: Math.random() > 0.6,
    pageVisits: Math.floor(Math.random() * 8),
    deviceType: Math.random() > 0.5 ? 'Android' : 'iOS',
    cityTier: Math.random() > 0.7 ? 1 : Math.random() > 0.4 ? 2 : 3,
    isUninstalled: Math.random() > 0.7,
    lastActiveDays: Math.floor(Math.random() * 60),
    competitorSignal: Math.random() > 0.8,
  }));
};

export const BatchExperiment: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Initial load of 15 users for demo (prompt mentions 5000 but table shows small sample)
    setUsers(generateMockUsers(15));
  }, []);

  const runExperiment = () => {
    setIsProcessing(true);
    setProgress(0);
    setResults([]);

    let processed = 0;
    const total = users.length;
    const newResults: BatchResult[] = [];

    const interval = setInterval(() => {
      if (processed >= total) {
        clearInterval(interval);
        setIsProcessing(false);
        return;
      }

      const user = users[processed];
      const decision = analyzeUser(user);
      
      // Simulate conversion logic based on discount and intent
      // Higher discount + Higher Intent = Higher Conversion Chance
      let conversionChance = 0.1; // Base
      if (decision.discount >= 70) conversionChance += 0.5;
      else if (decision.discount >= 45) conversionChance += 0.3;
      if (decision.scores.intentScore > 0.5) conversionChance += 0.3;
      
      const converted = Math.random() < conversionChance;

      newResults.push({ ...user, ...decision, converted });
      setResults([...newResults]);
      processed++;
      setProgress(Math.round((processed / total) * 100));
    }, 150); // Speed of simulation
  };

  const stats = {
    total: results.length,
    converted: results.filter(r => r.converted).length,
    avgDiscount: results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.discount, 0) / results.length) : 0,
    revenue: results.filter(r => r.converted).reduce((acc, r) => acc + (1000 * (1 - r.discount/100)), 0), // Base price 1000
  };

  const conversionRate = stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Users className="mr-2 text-blue-600" />
            Live Mock Hackathon Experiment
          </h2>
          <p className="text-slate-500 mt-1">Simulation of 15-Day Campaign on Lapsed Users</p>
        </div>
        <button
          onClick={runExperiment}
          disabled={isProcessing}
          className={`px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center space-x-2 ${
            isProcessing 
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : <Play size={20} />}
          <span>{isProcessing ? `Processing ${progress}%` : 'Start Simulation'}</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Processed Users</div>
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Conversion Rate</div>
          <div className="text-2xl font-bold text-green-600">{conversionRate}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Avg Discount Given</div>
          <div className="text-2xl font-bold text-blue-600">{stats.avgDiscount}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Est. Revenue</div>
          <div className="text-2xl font-bold text-purple-600">₹{Math.round(stats.revenue).toLocaleString()}</div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4 text-center">Intent</th>
                <th className="px-6 py-4 text-center">Affordability</th>
                <th className="px-6 py-4 text-center">Churn Score</th>
                <th className="px-6 py-4 text-center">AI Discount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Click "Start Simulation" to generate real-time results.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600">{result.id}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        result.scores.intentScore > 0.5 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {result.scores.intentScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{result.scores.affordabilityScore}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        result.scores.churnScore > 0.6 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {result.scores.churnScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">{result.discount}%</td>
                    <td className="px-6 py-4">
                      {result.converted ? (
                        <span className="flex items-center text-green-600 font-medium">
                          <CheckCircle size={16} className="mr-1.5" /> Converted
                        </span>
                      ) : (
                        <span className="flex items-center text-slate-400">
                          <XCircle size={16} className="mr-1.5" /> No Action
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};