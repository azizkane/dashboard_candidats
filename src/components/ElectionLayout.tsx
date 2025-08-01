import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, Users, BarChart3, Settings } from "lucide-react";

interface ElectionLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ElectionLayout = ({ children, activeTab, onTabChange }: ElectionLayoutProps) => {
  const [userRole] = useState("admin"); // Simulation du rôle utilisateur

  const tabs = [
    { id: "vote", label: "Vote", icon: Vote, roles: ["voter", "admin"] },
    { id: "candidates", label: "Candidats", icon: Users, roles: ["admin"] },
    { id: "results", label: "Résultats", icon: BarChart3, roles: ["admin", "voter"] },
    { id: "admin", label: "Administration", icon: Settings, roles: ["admin"] },
  ];

  const availableTabs = tabs.filter(tab => tab.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-r from-democratic to-success rounded-lg flex items-center justify-center">
                <Vote className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VoteCast Hub</h1>
                <p className="text-sm text-muted-foreground">Plateforme de gestion électorale</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-democratic/10 text-democratic border-democratic/20">
                {userRole === "admin" ? "Administrateur" : "Électeur"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "democratic" : "ghost"}
                  className="rounded-none border-b-2 border-transparent data-[active=true]:border-democratic"
                  data-active={activeTab === tab.id}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};