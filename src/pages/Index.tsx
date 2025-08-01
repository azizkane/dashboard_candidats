import { useState } from "react";
import { ElectionLayout } from "@/components/ElectionLayout";
import { VoteInterface } from "@/components/VoteInterface";
import { CandidateManagement } from "@/components/CandidateManagement";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vote, Users, BarChart3, User } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

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
      case "home":
      default:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-foreground mb-4">Bienvenue sur VoteCast Hub</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Votre plateforme complète de gestion électorale
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Link to="/voter">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-democratic/20 hover:border-democratic">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-democratic to-democratic/80 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Vote className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Espace Électeur</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Découvrez les candidats et exprimez votre choix démocratique
                    </p>
                    <Badge variant="outline" className="bg-democratic/10 text-democratic border-democratic/20">
                      Voter maintenant
                    </Badge>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/candidate">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-accent/20 hover:border-accent">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Espace Candidat</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Gérez votre candidature et votre programme électoral
                    </p>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      Mon dossier
                    </Badge>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/results">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-success/20 hover:border-success">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Résultats</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Consultez les résultats en temps réel
                    </p>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Voir les résultats
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Élection Municipale 2024 • Vote ouvert du 21 décembre
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="democratic" asChild>
                  <Link to="/voter">Participer au vote</Link>
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("admin")}>
                  Administration
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <ElectionLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </ElectionLayout>
  );
};

export default Index;
