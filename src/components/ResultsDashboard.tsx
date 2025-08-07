import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Vote, TrendingUp } from "lucide-react";

// Données simulées des résultats
const mockResults = [
  {
    id: 1,
    name: "Marie Dubois",
    party: "Parti Progressiste",
    votes: 3240,
    percentage: 35.2,
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612e0c2?w=80&h=80&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Jean Martin",
    party: "Union Démocratique",
    votes: 2890,
    percentage: 31.4,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    party: "Écologie Citoyenne",
    votes: 1950,
    percentage: 21.2,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Paul Rousseau",
    party: "Mouvement Citoyen",
    votes: 1120,
    percentage: 12.2,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
  }
];

const totalVotes = mockResults.reduce((sum, candidate) => sum + candidate.votes, 0);
const participation = 78.5;
const totalEligibleVoters = 11742;

export const ResultsDashboard = () => {
  const navigate = useNavigate();
  const winner = mockResults[0];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Résultats en Temps Réel</h2>
        <p className="text-muted-foreground">
          Élection Municipale 2024 - Dépouillement en cours
        </p>
      </div>

      {/* Statistiques générales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des votes</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">votes exprimés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participation}%</div>
            <p className="text-xs text-muted-foreground">
              {totalEligibleVoters.toLocaleString()} inscrits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bureaux dépouillés</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">156 sur 180 bureaux</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+2.3%</div>
            <p className="text-xs text-muted-foreground">vs. estimation</p>
          </CardContent>
        </Card>
      </div>

      {/* Candidat en tête */}
      <Card className="border-success/50 bg-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="default" className="bg-success">EN TÊTE</Badge>
            Candidat gagnant provisoire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <img 
              src={winner.photo}
              alt={winner.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-success"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold">{winner.name}</h3>
              <p className="text-muted-foreground">{winner.party}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-2xl font-bold text-success">{winner.percentage}%</span>
                <span className="text-muted-foreground">
                  {winner.votes.toLocaleString()} votes
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cartes d’élections cliquables */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des élections</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockResults.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => navigate(`/election/${candidate.id}/candidats`)}
              className="cursor-pointer border rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={candidate.photo}
                  alt={candidate.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.party}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
