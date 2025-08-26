import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Edit3,
  Save,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "@/components/common/AppShell";

const CandidatePage = () => {
  const [candidateData, setCandidateData] = useState({
    name: "Sophie Laurent",
    party: "Écologie Citoyenne",
    age: "39",
    profession: "Ingénieure",
    location: "Marseille 8e",
    email: "sophie.laurent@email.com",
    phone: "06 12 34 56 78",
    program: "Transition écologique, Transport public, Espaces verts urbains",
    detailedProgram: "Mon programme vise à transformer notre ville en un modèle de développement durable...",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  });

  const [documents, setDocuments] = useState([
    { name: "Carte d'identité", status: "uploaded", required: true },
    { name: "Casier judiciaire", status: "uploaded", required: true },
    { name: "Parrainage", status: "pending", required: true },
    { name: "Programme détaillé", status: "uploaded", required: false },
    { name: "Photo officielle", status: "uploaded", required: true },
  ]);

  const [applicationStatus] = useState("pending"); // pending, approved, rejected
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès.",
    });
  };

  const handleDocumentUpload = (docName: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.name === docName 
        ? { ...doc, status: "uploaded" }
        : doc
    ));
    toast({
      title: "Document uploadé",
      description: `${docName} a été téléchargé avec succès.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-success">Candidature Approuvée</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-warning text-warning">En Attente de Validation</Badge>;
      case "rejected":
        return <Badge variant="destructive">Candidature Rejetée</Badge>;
      default:
        return <Badge variant="outline">Statut Inconnu</Badge>;
    }
  };

  const getDocumentIcon = (status: string) => {
    switch (status) {
      case "uploaded":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const completionPercentage = Math.round((documents.filter(doc => doc.status === "uploaded").length / documents.length) * 100);

  return (
    <AppShell role="candidat" title="Espace Candidat">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profil du candidat */}
            <Card className="border border-blue-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mon Profil
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Sauvegarder
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4" />
                      Modifier
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={candidateData.photo}
                    alt="Photo du candidat"
                    className="w-20 h-20 rounded-full object-cover border-2 border-democratic/20"
                  />
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                      Changer la photo
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={candidateData.name}
                      onChange={(e) => setCandidateData({...candidateData, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="party">Parti politique</Label>
                    <Input
                      id="party"
                      value={candidateData.party}
                      onChange={(e) => setCandidateData({...candidateData, party: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={candidateData.profession}
                      onChange={(e) => setCandidateData({...candidateData, profession: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Âge</Label>
                    <Input
                      id="age"
                      value={candidateData.age}
                      onChange={(e) => setCandidateData({...candidateData, age: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={candidateData.location}
                      onChange={(e) => setCandidateData({...candidateData, location: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={candidateData.email}
                      onChange={(e) => setCandidateData({...candidateData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programme électoral */}
            <Card className="border border-blue-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Programme Électoral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="program">Résumé du programme</Label>
                  <Input
                    id="program"
                    value={candidateData.program}
                    onChange={(e) => setCandidateData({...candidateData, program: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="detailedProgram">Programme détaillé</Label>
                  <Textarea
                    id="detailedProgram"
                    value={candidateData.detailedProgram}
                    onChange={(e) => setCandidateData({...candidateData, detailedProgram: e.target.value})}
                    disabled={!isEditing}
                    rows={6}
                    placeholder="Développez votre programme électoral en détail..."
                  />
                </div>
                {!isEditing && (
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4" />
                    Prévisualiser comme les électeurs
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Progression de la candidature */}
            <Card className="border border-blue-200 shadow-sm">
              <CardHeader>
                <CardTitle>Progression</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dossier complété</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {completionPercentage === 100 
                    ? "Votre dossier est complet et en cours de validation."
                    : "Complétez votre dossier pour validation."
                  }
                </p>
              </CardContent>
            </Card>

            {/* Documents requis */}
            <Card className="border border-blue-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.status)}
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        {doc.required && (
                          <p className="text-xs text-muted-foreground">Obligatoire</p>
                        )}
                      </div>
                    </div>
                    {doc.status !== "uploaded" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDocumentUpload(doc.name)}
                      >
                        <Upload className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Calendrier électoral */}
            <Card className="border border-blue-200 shadow-sm">
              <CardHeader>
                <CardTitle>Calendrier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Dépôt candidature</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm">Validation dossier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    <span className="text-sm">Campagne (6-20 Déc)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    <span className="text-sm">Vote (21 Déc)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="border border-blue-200 shadow-sm">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="democratic" className="w-full">
                  Télécharger attestation
                </Button>
                <Button variant="outline" className="w-full">
                  Contacter l'administration
                </Button>
                <Link to="/results">
                  <Button variant="outline" className="w-full">
                    Voir les sondages
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default CandidatePage;