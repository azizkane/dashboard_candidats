import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, User, MapPin } from "lucide-react";

// Données simulées des candidats
const mockCandidates = [
  {
    id: 1,
    name: "Marie Dubois",
    party: "Parti Progressiste",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612e0c2?w=150&h=150&fit=crop&crop=face",
    program: "Éducation, Environnement, Justice sociale",
    age: 45,
    profession: "Avocate",
    location: "Paris 15e"
  },
  {
    id: 2,
    name: "Jean Martin",
    party: "Union Démocratique", 
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    program: "Économie, Sécurité, Innovation",
    age: 52,
    profession: "Entrepreneur",
    location: "Lyon 3e"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    party: "Écologie Citoyenne",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    program: "Transition écologique, Transport public",
    age: 39,
    profession: "Ingénieure",
    location: "Marseille 8e"
  },
  {
    id: 4,
    name: "Paul Rousseau",
    party: "Mouvement Citoyen",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    program: "Santé publique, Emploi, Logement",
    age: 48,
    profession: "Médecin",
    location: "Toulouse 1er"
  }
];

export const VoteInterface = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();

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
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Vote enregistré !</h2>
          <p className="text-muted-foreground">
            Merci d'avoir participé à cette élection. Votre vote a été pris en compte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Élection Municipale 2024</h2>
        <p className="text-muted-foreground">
          Choisissez votre candidat pour le poste de maire
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockCandidates.map((candidate) => (
          <Card 
            key={candidate.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCandidate === candidate.id 
                ? "ring-2 ring-democratic border-democratic" 
                : "hover:border-democratic/50"
            }`}
            onClick={() => setSelectedCandidate(candidate.id)}
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-6">
        <Button 
          size="lg" 
          variant="democratic"
          onClick={handleVote}
          disabled={!selectedCandidate}
          className="px-8"
        >
          Confirmer mon vote
        </Button>
      </div>
    </div>
  );
};