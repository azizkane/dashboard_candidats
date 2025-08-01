import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, User, MapPin, Search, Vote, Eye, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Données simulées des candidats
const mockCandidates = [
  {
    id: 1,
    name: "Marie Dubois",
    party: "Parti Progressiste",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612e0c2?w=150&h=150&fit=crop&crop=face",
    program: "Éducation, Environnement, Justice sociale",
    detailedProgram: "Réforme du système éducatif, transition énergétique, politique sociale inclusive",
    age: 45,
    profession: "Avocate",
    location: "Paris 15e",
    experience: "15 ans en droit public"
  },
  {
    id: 2,
    name: "Jean Martin",
    party: "Union Démocratique", 
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    program: "Économie, Sécurité, Innovation",
    detailedProgram: "Développement économique local, amélioration de la sécurité urbaine, digitalisation",
    age: 52,
    profession: "Entrepreneur",
    location: "Lyon 3e",
    experience: "20 ans en entreprise"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    party: "Écologie Citoyenne",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    program: "Transition écologique, Transport public",
    detailedProgram: "Plan climat local, développement des transports verts, espaces verts urbains",
    age: 39,
    profession: "Ingénieure",
    location: "Marseille 8e",
    experience: "12 ans en environnement"
  },
  {
    id: 4,
    name: "Paul Rousseau",
    party: "Mouvement Citoyen",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    program: "Santé publique, Emploi, Logement",
    detailedProgram: "Centres de santé de proximité, création d'emplois locaux, logements sociaux",
    age: 48,
    profession: "Médecin",
    location: "Toulouse 1er",
    experience: "18 ans en santé publique"
  }
];

const VoterPage = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingDetails, setViewingDetails] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredCandidates = mockCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVote = () => {
    if (!selectedCandidate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un candidat avant de voter.",
        variant: "destructive"
      });
      return;
    }

    setHasVoted(true);
    const candidate = mockCandidates.find(c => c.id === selectedCandidate);
    toast({
      title: "Vote enregistré !",
      description: `Votre vote pour ${candidate?.name} a été enregistré avec succès.`,
      variant: "default"
    });
  };

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gradient-to-r from-democratic to-success rounded-lg flex items-center justify-center">
                  <Vote className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">VoteCast Hub</h1>
                  <p className="text-sm text-muted-foreground">Espace Électeur</p>
                </div>
              </Link>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Vote Confirmé
              </Badge>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <CheckCircle className="h-24 w-24 text-success mx-auto" />
            <h2 className="text-3xl font-bold text-foreground">Vote enregistré !</h2>
            <p className="text-muted-foreground">
              Merci d'avoir participé à cette élection. Votre vote a été pris en compte de manière sécurisée.
            </p>
            <div className="space-y-3">
              <Link to="/results">
                <Button variant="democratic" className="w-full">
                  Voir les résultats
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (viewingDetails) {
    const candidate = mockCandidates.find(c => c.id === viewingDetails);
    if (!candidate) return null;

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gradient-to-r from-democratic to-success rounded-lg flex items-center justify-center">
                  <Vote className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">VoteCast Hub</h1>
                  <p className="text-sm text-muted-foreground">Détails du candidat</p>
                </div>
              </Link>
              <Button variant="outline" onClick={() => setViewingDetails(null)}>
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <img 
                  src={candidate.photo}
                  alt={candidate.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-democratic/20"
                />
                <CardTitle className="text-2xl">{candidate.name}</CardTitle>
                <Badge variant="outline" className="w-fit mx-auto">
                  {candidate.party}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Profession</p>
                      <p className="text-sm text-muted-foreground">{candidate.profession}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Localisation</p>
                      <p className="text-sm text-muted-foreground">{candidate.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Expérience</h3>
                  <p className="text-muted-foreground">{candidate.experience}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Programme électoral</h3>
                  <p className="text-muted-foreground">{candidate.detailedProgram}</p>
                </div>

                <div className="pt-4 space-y-3">
                  <Button 
                    variant="democratic" 
                    className="w-full"
                    onClick={() => {
                      setSelectedCandidate(candidate.id);
                      setViewingDetails(null);
                    }}
                  >
                    Sélectionner ce candidat
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setViewingDetails(null)}
                  >
                    Continuer à parcourir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-r from-democratic to-success rounded-lg flex items-center justify-center">
                <Vote className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VoteCast Hub</h1>
                <p className="text-sm text-muted-foreground">Espace Électeur</p>
              </div>
            </Link>
            <Badge variant="outline" className="bg-democratic/10 text-democratic border-democratic/20">
              Électeur
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">Élection Municipale 2024</h2>
            <p className="text-muted-foreground">
              Découvrez les candidats et exprimez votre choix
            </p>
          </div>

          {/* Barre de recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un candidat, parti ou programme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Candidat sélectionné */}
          {selectedCandidate && (
            <Card className="border-democratic bg-democratic/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-democratic" />
                  Candidat sélectionné
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={mockCandidates.find(c => c.id === selectedCandidate)?.photo}
                      alt="Candidat sélectionné"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {mockCandidates.find(c => c.id === selectedCandidate)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {mockCandidates.find(c => c.id === selectedCandidate)?.party}
                      </p>
                    </div>
                  </div>
                  <Button variant="democratic" onClick={handleVote}>
                    Confirmer mon vote
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des candidats */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCandidates.map((candidate) => (
              <Card 
                key={candidate.id}
                className={`hover:shadow-lg transition-all ${
                  selectedCandidate === candidate.id 
                    ? "ring-2 ring-democratic border-democratic" 
                    : "hover:border-democratic/50"
                }`}
              >
                <CardHeader className="text-center">
                  <div className="relative">
                    <img 
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    {selectedCandidate === candidate.id && (
                      <CheckCircle className="absolute -top-2 -right-2 h-6 w-6 text-success bg-background rounded-full" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{candidate.name}</CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">
                    {candidate.party}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{candidate.profession}, {candidate.age} ans</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-1">Programme :</p>
                    <p className="text-sm text-muted-foreground">{candidate.program}</p>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button 
                      variant="outline"
                      onClick={() => setViewingDetails(candidate.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </Button>
                    <Button 
                      variant={selectedCandidate === candidate.id ? "democratic" : "outline"}
                      onClick={() => setSelectedCandidate(candidate.id)}
                      className="flex-1"
                    >
                      {selectedCandidate === candidate.id ? "Sélectionné" : "Choisir"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun candidat ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VoterPage;