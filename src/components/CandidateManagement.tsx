import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, User, MapPin } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  party: string;
  photo: string;
  program: string;
  age: number;
  profession: string;
  location: string;
  status: "active" | "pending" | "rejected";
}

const initialCandidates: Candidate[] = [
  {
    id: 1,
    name: "Marie Dubois",
    party: "Parti Progressiste",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612e0c2?w=150&h=150&fit=crop&crop=face",
    program: "Éducation, Environnement, Justice sociale",
    age: 45,
    profession: "Avocate",
    location: "Paris 15e",
    status: "active"
  },
  {
    id: 2,
    name: "Jean Martin",
    party: "Union Démocratique", 
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    program: "Économie, Sécurité, Innovation",
    age: 52,
    profession: "Entrepreneur",
    location: "Lyon 3e",
    status: "active"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    party: "Écologie Citoyenne",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    program: "Transition écologique, Transport public",
    age: 39,
    profession: "Ingénieure",
    location: "Marseille 8e",
    status: "pending"
  }
];

export const CandidateManagement = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    party: "",
    photo: "",
    program: "",
    age: "",
    profession: "",
    location: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      party: "",
      photo: "",
      program: "",
      age: "",
      profession: "",
      location: ""
    });
    setEditingCandidate(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCandidate) {
      setCandidates(prev => prev.map(c => 
        c.id === editingCandidate.id 
          ? { ...c, ...formData, age: parseInt(formData.age) }
          : c
      ));
      toast({
        title: "Candidat modifié",
        description: "Les informations du candidat ont été mises à jour.",
      });
    } else {
      const newCandidate: Candidate = {
        id: Date.now(),
        ...formData,
        age: parseInt(formData.age),
        status: "pending"
      };
      setCandidates(prev => [...prev, newCandidate]);
      toast({
        title: "Candidat ajouté",
        description: "Le nouveau candidat a été ajouté avec succès.",
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      party: candidate.party,
      photo: candidate.photo,
      program: candidate.program,
      age: candidate.age.toString(),
      profession: candidate.profession,
      location: candidate.location
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Candidat supprimé",
      description: "Le candidat a été retiré de la liste.",
      variant: "destructive"
    });
  };

  const handleStatusChange = (id: number, status: "active" | "pending" | "rejected") => {
    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, status } : c
    ));
    toast({
      title: "Statut modifié",
      description: `Le statut du candidat a été changé en ${status}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-success">Actif</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-warning text-warning">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestion des Candidats</h2>
          <p className="text-muted-foreground">
            Gérez les candidatures et validez les dossiers
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="democratic" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Ajouter un candidat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCandidate ? "Modifier le candidat" : "Nouveau candidat"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="party">Parti politique</Label>
                <Input
                  id="party"
                  value={formData.party}
                  onChange={(e) => setFormData({...formData, party: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="photo">URL de la photo</Label>
                <Input
                  id="photo"
                  value={formData.photo}
                  onChange={(e) => setFormData({...formData, photo: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="program">Programme</Label>
                <Textarea
                  id="program"
                  value={formData.program}
                  onChange={(e) => setFormData({...formData, program: e.target.value})}
                  placeholder="Décrivez le programme du candidat..."
                  required
                />
              </div>
              <Button type="submit" className="w-full" variant="democratic">
                {editingCandidate ? "Modifier" : "Ajouter"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="relative">
                <img 
                  src={candidate.photo}
                  alt={candidate.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                />
                <div className="absolute -top-2 -right-2">
                  {getStatusBadge(candidate.status)}
                </div>
              </div>
              <CardTitle className="text-lg">{candidate.name}</CardTitle>
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
              <p className="text-sm">{candidate.program}</p>
              
              <div className="flex gap-2 pt-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(candidate)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(candidate.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              {candidate.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={() => handleStatusChange(candidate.id, "active")}
                    className="flex-1"
                  >
                    Valider
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleStatusChange(candidate.id, "rejected")}
                    className="flex-1"
                  >
                    Rejeter
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};