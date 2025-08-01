import { useState } from "react";
import { ElectionLayout } from "@/components/ElectionLayout";
import { VoteInterface } from "@/components/VoteInterface";
import { CandidateManagement } from "@/components/CandidateManagement";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("vote");

  const renderContent = () => {
    switch (activeTab) {
      case "vote":
        return <VoteInterface />;
      case "candidates":
        return <CandidateManagement />;
      case "results":
        return <ResultsDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <VoteInterface />;
    }
  };

  return (
    <ElectionLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </ElectionLayout>
  );
};

export default Index;
