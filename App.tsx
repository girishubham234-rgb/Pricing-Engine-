import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { UserSimulator } from './components/UserSimulator';
import { BatchExperiment } from './components/BatchExperiment';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'simulator':
        return <UserSimulator />;
      case 'experiment':
        return <BatchExperiment />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
          {renderContent()}
        </main>
      </div>
    </Layout>
  );
};

export default App;