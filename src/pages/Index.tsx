import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vote, User, CloudMoonRain } from "lucide-react";
import { Link } from "react-router-dom";

const ElectionLayout = ({ children, activeTab, onTabChange, hideTabs = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideTabs && (
        <div className="bg-white border-b px-6 py-4 flex gap-6 shadow-sm">
          <button
            onClick={() => onTabChange("vote")}
            className={`text-sm font-medium ${activeTab === "vote" ? "text-blue-600" : "text-gray-600"}`}
          >
            Vote
          </button>
          <button
            onClick={() => onTabChange("candidates")}
            className={`text-sm font-medium ${activeTab === "candidates" ? "text-blue-600" : "text-gray-600"}`}
          >
            Candidats
          </button>
          <button
            onClick={() => onTabChange("results")}
            className={`text-sm font-medium ${activeTab === "results" ? "text-blue-600" : "text-gray-600"}`}
          >
            Résultats
          </button>
          <button
            onClick={() => onTabChange("admin")}
            className={`text-sm font-medium ${activeTab === "admin" ? "text-blue-600" : "text-gray-600"}`}
          >
            Admin
          </button>
        </div>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-10 px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-foreground mb-4">Bienvenue sur Votify</h2>
          <p className="text-xl text-muted-foreground" >
            Votre plateforme complète de gestion électorale
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {/* Espace Électeur */}
          <Link to="/login-electeur">
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
                  Se connecter
                </Badge>
              </CardContent>
            </Card>
          </Link>

          {/* Espace Candidat */}
          <Link to="/login-candidat">
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
                  Se connecter
                </Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <ElectionLayout activeTab={activeTab} onTabChange={setActiveTab} hideTabs>
      {renderContent()}
    </ElectionLayout>
  );
};

export default Index;
