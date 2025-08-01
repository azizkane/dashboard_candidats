import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Users, 
  Vote, 
  Calendar, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database
} from "lucide-react";

export const AdminDashboard = () => {
  const { toast } = useToast();

  const handleElectionAction = (action: string) => {
    toast({
      title: "Action exécutée",
      description: `${action} avec succès.`,
    });
  };

  const systemStats = {
    totalVoters: 11742,
    registeredCandidates: 4,
    activeCandidates: 3,
    pendingCandidates: 1,
    systemUptime: 99.8,
    lastBackup: "Il y a 2 heures"
  };

  const securityAlerts = [
    { id: 1, type: "info", message: "Sauvegarde automatique effectuée", time: "10:30" },
    { id: 2, type: "warning", message: "Pic d'activité détecté sur les serveurs", time: "09:15" },
    { id: 3, type: "success", message: "Mise à jour de sécurité appliquée", time: "08:00" },
  ];

  const electionPhases = [
    { name: "Inscription des candidats", status: "completed", date: "15 Nov - 30 Nov" },
    { name: "Validation des dossiers", status: "current", date: "1 Déc - 5 Déc" },
    { name: "Campagne électorale", status: "upcoming", date: "6 Déc - 20 Déc" },
    { name: "Vote", status: "upcoming", date: "21 Déc" },
    { name: "Dépouillement", status: "upcoming", date: "21 Déc soir" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "current":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-success">Terminé</Badge>;
      case "current":
        return <Badge variant="default" className="bg-warning">En cours</Badge>;
      default:
        return <Badge variant="outline">À venir</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Shield className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Tableau de Bord Administrateur</h2>
        <p className="text-muted-foreground">
          Gérez et supervisez l'ensemble du processus électoral
        </p>
      </div>

      {/* Statistiques système */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Électeurs inscrits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalVoters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +127 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidats</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeCandidates}/{systemStats.registeredCandidates}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.pendingCandidates} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilité système</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{systemStats.systemUptime}%</div>
            <p className="text-xs text-muted-foreground">
              Excellent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière sauvegarde</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">✓</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.lastBackup}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="democratic" 
              className="justify-start"
              onClick={() => handleElectionAction("Sauvegarde manuelle déclenchée")}
            >
              <Database className="h-4 w-4" />
              Sauvegarder
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleElectionAction("Rapport généré")}
            >
              <Vote className="h-4 w-4" />
              Générer rapport
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleElectionAction("Notifications envoyées")}
            >
              <Users className="h-4 w-4" />
              Notifier électeurs
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleElectionAction("Test système effectué")}
            >
              <Shield className="h-4 w-4" />
              Test système
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendrier électoral */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendrier Électoral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {electionPhases.map((phase, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                {getStatusIcon(phase.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{phase.name}</p>
                    {getStatusBadge(phase.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{phase.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertes sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Alertes Système
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Progression générale */}
      <Card>
        <CardHeader>
          <CardTitle>Progression de l'Élection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Préparation électorale</span>
              <span>60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="text-sm text-muted-foreground">
            Phase actuelle: Validation des candidatures • Prochaine étape: Campagne électorale
          </div>
        </CardContent>
      </Card>
    </div>
  );
};