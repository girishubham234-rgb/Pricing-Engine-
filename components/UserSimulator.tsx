import React, { useState, useEffect } from 'react';
import { UserProfile, PricingDecision } from '../types';
import { analyzeUser } from '../services/pricingEngine';
import { generateUserInsight } from '../services/geminiService';
import { RefreshCw, Smartphone, Globe, ShoppingCart, Activity, AlertTriangle, Zap, CheckCircle, Sparkles } from 'lucide-react';

export const UserSimulator: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    id: 'SIM-001',
    name: 'Test User',
    mockTestsTaken: 3,
    addedToCart: true,
    pageVisits: 5,
    deviceType: 'Android',
    cityTier: 2,
    isUninstalled: false,
    lastActiveDays: 5,
    competitorSignal: false,
  });

  const [decision, setDecision] = useState<PricingDecision | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Real-time calculation when user inputs change
  useEffect(() => {
    const result = analyzeUser(user);
    setDecision(result);
    // Reset AI insight when parameters change to avoid stale insights
    setAiInsight('');
  }, [user]);

  const handleGenerateInsight = async () => {
    if (!decision) return;
    setLoadingAi(true);
    const insight = await generateUserInsight(user, decision);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <Zap className="mr-2 text-blue-600" />
        Real-time Scoring Simulator
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">User Attributes</h3>
          
          <div className="space-y-4">
            {/* Device & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Device Type</label>
                <div className="flex space-x-2">
                  {['Android', 'iOS', 'Web'].map(type => (
                    <button
                      key={type}
                      onClick={() => updateField('deviceType', type)}
                      className={`px-3 py-2 text-sm rounded-md border transition-all ${
                        user.deviceType === type 
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">City Tier</label>
                <select 
                  value={user.cityTier}
                  onChange={(e) => updateField('cityTier', parseInt(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={1}>Tier 1 (Metro)</option>
                  <option value={2}>Tier 2</option>
                  <option value={3}>Tier 3 (Rural)</option>
                </select>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Engagement</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 focus-within:border-blue-300 transition-colors">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">Mock Tests Taken</div>
                  <input 
                    type="number" 
                    min="0"
                    value={user.mockTestsTaken}
                    onChange={(e) => updateField('mockTestsTaken', parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-lg font-semibold text-slate-700"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 focus-within:border-blue-300 transition-colors">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">Page Visits</div>
                  <input 
                    type="number" 
                    min="0"
                    value={user.pageVisits}
                    onChange={(e) => updateField('pageVisits', parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-lg font-semibold text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Booleans */}
            <div className="space-y-3 pt-2">
              <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${user.addedToCart ? 'bg-blue-50 border-blue-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input 
                  type="checkbox" 
                  checked={user.addedToCart}
                  onChange={(e) => updateField('addedToCart', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex items-center">
                  <ShoppingCart size={18} className={`mr-2 ${user.addedToCart ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className={`text-sm font-medium ${user.addedToCart ? 'text-blue-700' : 'text-slate-700'}`}>Added to Cart (High Intent)</span>
                </div>
              </label>

              <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${user.competitorSignal ? 'bg-red-50 border-red-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input 
                  type="checkbox" 
                  checked={user.competitorSignal}
                  onChange={(e) => updateField('competitorSignal', e.target.checked)}
                  className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                />
                <div className="flex items-center">
                  <Activity size={18} className={`mr-2 ${user.competitorSignal ? 'text-red-500' : 'text-slate-500'}`} />
                  <span className={`text-sm font-medium ${user.competitorSignal ? 'text-red-700' : 'text-slate-700'}`}>Competitor Signal Detected</span>
                </div>
              </label>
              
              <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${user.isUninstalled ? 'bg-orange-50 border-orange-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input 
                  type="checkbox" 
                  checked={user.isUninstalled}
                  onChange={(e) => updateField('isUninstalled', e.target.checked)}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <div className="flex items-center">
                  <AlertTriangle size={18} className={`mr-2 ${user.isUninstalled ? 'text-orange-500' : 'text-slate-500'}`} />
                  <span className={`text-sm font-medium ${user.isUninstalled ? 'text-orange-700' : 'text-slate-700'}`}>App Uninstalled</span>
                </div>
              </label>
            </div>

            {/* Inactivity Slider */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Days Inactive: <span className="text-blue-600 font-bold text-lg">{user.lastActiveDays}</span></label>
              <input 
                type="range" 
                min="0" 
                max="60" 
                value={user.lastActiveDays}
                onChange={(e) => updateField('lastActiveDays', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Active Today</span>
                <span>60 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex flex-col space-y-6">
           {decision ? (
            <>
              {/* Score Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl text-center border transition-all duration-300 ${decision.scores.intentScore > 0.5 ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Intent</div>
                  <div className="text-3xl font-black text-slate-800">{decision.scores.intentScore}</div>
                </div>
                <div className={`p-4 rounded-xl text-center border transition-all duration-300 ${decision.scores.affordabilityScore < 0.5 ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Affordability</div>
                  <div className="text-3xl font-black text-slate-800">{decision.scores.affordabilityScore}</div>
                </div>
                <div className={`p-4 rounded-xl text-center border transition-all duration-300 ${decision.scores.churnScore > 0.6 ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Churn Risk</div>
                  <div className="text-3xl font-black text-slate-800">{decision.scores.churnScore}</div>
                </div>
              </div>

              {/* Offer Card */}
              <div className="bg-gradient-to-br from-indigo-900 to-purple-800 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden transition-all duration-500 transform hover:scale-[1.02]">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-blue-500 opacity-20 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-2 flex items-center">
                    <Sparkles size={14} className="mr-1" /> Recommended Offer
                  </h3>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-6xl font-extrabold tracking-tight">{decision.discount}%</span>
                    <span className="text-2xl text-indigo-200 font-light">OFF</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner">
                    <p className="text-sm font-medium leading-relaxed text-indigo-50">{decision.reason}</p>
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md shadow-sm">
                      <Zap size={16} className="text-white" />
                    </div>
                    <h4 className="font-bold text-slate-700">GenAI Analysis</h4>
                  </div>
                  {!aiInsight && !loadingAi && (
                     <button 
                       onClick={handleGenerateInsight}
                       className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold hover:bg-blue-100 transition-colors"
                     >
                       Generate Insight
                     </button>
                  )}
                </div>
                
                <div className="min-h-[60px] bg-slate-50 rounded-lg p-4 border border-slate-100">
                  {loadingAi ? (
                    <div className="flex items-center space-x-2 text-slate-400 animate-pulse">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                      <span className="text-sm font-medium">Analyzing user persona...</span>
                    </div>
                  ) : aiInsight ? (
                    <p className="text-sm text-slate-700 leading-relaxed italic">
                      "{aiInsight}"
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 text-center italic">
                      Click generate to get AI-powered explanation for this pricing strategy.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
              <RefreshCw size={48} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-500">Initializing...</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};