// =============================
// API base configuration
// =============================
const API_BASE_URL = "https://5a1d38016feb.ngrok-free.app/api";
const STORAGE_BASE_URL = "https://5a1d38016feb.ngrok-free.app/storage";

const commonHeaders = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
  "Accept": "application/json",
};

// Centralized auth header builder (accepts tokens stored under several common keys)
const getAuthHeaders = () => {
  let token = localStorage.getItem('auth_token');
  if (!token) token = localStorage.getItem('token') || sessionStorage.getItem('token') || sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  try {
    if (!token) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      token = user?.token || token;
    }
  } catch {}
  return { ...commonHeaders, Authorization: token ? `Bearer ${token}` : '' };
};

// =============================
// Candidats: profils et documents
// =============================

export const updateCandidateProfile = async (candidateData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidate/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(candidateData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update candidate profile:", error);
    throw error;
  }
};

export const uploadCandidateDocument = async (documentData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidate/documents/upload`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(documentData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to upload document:", error);
    throw error;
  }
};

export const fetchCandidatesByElection = async (electionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidats_par_election/${electionId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erreur lors du chargement des candidats:', error);
    throw error;
  }
};

// =============================
// Votes
// =============================
export const checkUserVoteStatus = async (electionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listes_votes?election_id=${electionId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    const token = localStorage.getItem('auth_token');
    if (token) {
      const userId = JSON.parse(atob(token.split('.')[1])).sub;
      return data.data.some((vote: any) => vote.user_id == userId);
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification du vote:', error);
    throw error;
  }
};

export const fetchCandidatureDetails = async (electionId: string, candidatId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidature/${electionId}/${candidatId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erreur lors du chargement de la candidature:", error);
    throw error;
  }
};

export const voteForCandidate = async (candidatId: number, electionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/voter`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ candidat_id: candidatId, election_id: electionId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Impossible de voter:', error);
    throw error;
  }
};

// =============================
// Assets helpers (programmes, photos)
// =============================
export const getProgramDownloadUrl = (programmePath: string) => {
  return `${STORAGE_BASE_URL}/${programmePath}`;
};

export const getCandidatePhotoUrl = (profilPath: string) => {
  return profilPath ? `${STORAGE_BASE_URL}/${profilPath}` : '/user.png';
};

export const fetchCandidateProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch candidate profile:", error);
    throw error;
  }
};

export const fetchVoterProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch voter profile:", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erreur de chargement des utilisateurs :", error);
    throw error;
  }
};

export const fetchElections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/liste_elections`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erreur de chargement des élections :", error);
    throw error;
  }
};

export const submitCandidature = async (formData: FormData) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/postuler`, {
      method: "POST",
      headers: { 
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json",
        Authorization: token ? `Bearer ${token}` : '' 
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la soumission de la candidature :", error);
    throw error;
  }
};

export const fetchElectionsListForCandidate = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/liste_elections`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erreur lors du chargement des élections pour le candidat:', error);
    throw error;
  }
};

export const getElectionImageUrl = (imagePath: string) => {
  return `${STORAGE_BASE_URL}/${imagePath}`;
};

export const fetchMyCandidature = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ma_candidature`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Erreur lors du chargement de la candidature:', error);
    throw error;
  }
};

export const deleteCandidature = async (candidatureId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/supprimer_candidature/${candidatureId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la suppression de la candidature:', error);
    throw error;
  }
};

export const getDocumentDownloadUrl = (documentPath: string) => {
  return `${STORAGE_BASE_URL}/${documentPath}`;
};

export const fetchCandidatureById = async (candidatureId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidature/${candidatureId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erreur chargement candidature:", error);
    throw error;
  }
};

export const updateCandidature = async (candidatureId: string, formData: FormData) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/modifier_candidature/${candidatureId}`, {
      method: "POST", 
      headers: { 
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json",
        Authorization: token ? `Bearer ${token}` : '' 
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur modification:", error);
    throw error;
  }
};

// =============================
// Liste de toutes les candidatures (pour admin)
// =============================
export const fetchAllCandidatures = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidatures`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erreur lors du chargement des candidatures:', error);
    throw error;
  }
};

// =============================
// Candidatures par élection (pour admin)
// =============================
export const fetchCandidaturesByElection = async (electionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidatures/election/${electionId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erreur lors du chargement des candidatures par élection:', error);
    throw error;
  }
};

// =============================
// Profils (utilisateur / électeur)
// =============================
export const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur de chargement du profil utilisateur:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: number, userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    const data = await response.json();
    return (data && (data.user || data.data)) ? (data.user || data.data) : (typeof data === 'object' ? data : userData);
  } catch (error) {
    console.error('Erreur de modification du profil:', error);
    throw error;
  }
};

export const getProfileAvatarUrl = (profilePath: string, version: number = 0) => {
  return profilePath ? `${STORAGE_BASE_URL}/${profilePath}${version ? `?v=${version}` : ''}` : '';
};

export const fetchElectorProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur de chargement du profil électeur:', error);
    throw error;
  }
};

export const updateElectorProfile = async (userId: number, userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    const data = await response.json();
    return (data && (data.user || data.data)) ? (data.user || data.data) : (typeof data === 'object' ? data : userData);
  } catch (error) {
    console.error('Erreur de modification du profil électeur:', error);
    throw error;
  }
};

// =============================
// PVs (procès-verbaux)
// =============================
export const fetchActivePVs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/liste_pvs_actifs`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erreur lors du chargement des PVs:', error);
    throw error;
  }
};

function slugify(s: string): string {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function getExt(path: string): string {
  const m = path.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  return m ? m[1].toLowerCase() : '';
}

export const getPvDownloadProps = (pv: any) => {
  const href = pv.contenu_pdf ? `${STORAGE_BASE_URL}/${pv.contenu_pdf}` : '#';
  const ext = getExt(pv.contenu_pdf || '') || 'pdf';
  const fname = `${slugify(pv.titre || 'pv')}.${ext}`;
  return { href, download: fname };
};

export const fetchElectionsList = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/liste_elections`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erreur lors du chargement des élections.", error);
    throw error;
  }
};

export const fetchVotesForCandidate = async (electionId: number, candidatId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/votes/${electionId}/${candidatId}?_t=${Date.now()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return Number(data?.votes ?? data?.total ?? data?.count ?? data?.data?.votes ?? 0);
  } catch (error) {
    console.error('Erreur getVotesForCandidate:', error);
    throw error;
  }
};

// =============================
// URLs helpers (stockage / images)
// =============================
export const getStorageUrl = (path?: string | null) => {
  if (!path) return null;
  const p = String(path).trim();
  if (/^https?:\/\//i.test(p)) return p;

  const cleanBase = String(STORAGE_BASE_URL).replace(/\/+$/, '');
  const cleanPath = p.replace(/^\/+/, '');
  const withStorage = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
  return `${cleanBase}/${withStorage}`;
};

export const getResultElectionImage = (imagePath?: string | null) => {
  return getStorageUrl(imagePath) || '/default-election.jpg';
};

export const getResultCandidateImage = (profilPath?: string | null) => {
  return getStorageUrl(profilPath) || '/user.png';
};

export const fetchCandidatesForElection = async (electionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidats_par_election/${electionId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erreur chargement candidats:', error);
    throw error;
  }
};

// =============================
// Utilisateur courant & Authentification
// =============================
// New function to fetch current user profile
export const fetchCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: getAuthHeaders(),
      // credentials: "include", // décommente si tu utilises Sanctum en cookies plutôt que Bearer
    });
    if (!response.ok) {
      const txt = await response.text().catch(() => "");
      throw new Error(`Error: ${response.status} ${txt}`);
    }
    return await response.json(); // doit contenir { id, nom, prenom, email, ... }
  } catch (error) {
    console.error("Erreur de chargement de l'utilisateur actuel:", error); // c'est bon comme ça
    throw error;
  }
};




export const loginCandidate = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login-candidat`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Login candidate failed:", error);
    throw error;
  }
};

export const loginElector = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login-electeur`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Login elector failed:", error);
    throw error;
  }
};

export const registerUser = async (userData: { nom: string; prenom: string; email: string; }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const logoutUser = async (token: string | null) => {
  try {
    const headers = { ...commonHeaders, Authorization: token ? `Bearer ${token}` : '' };
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

// Simpler logout that relies on the stored token
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

// =============================
// Notifications
// =============================
export type NotificationItem = {
  id: string;
  type: string;
  data?: any;
  created_at: string;
};

export const fetchNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    // Some backends return an array directly, others under data
    return (Array.isArray(data) ? data : (data?.data ?? [])) as NotificationItem[];
  } catch (error) {
    console.error('Erreur lors du chargement des notifications:', error);
    throw error;
  }
};

export const markNotificationsRead = async (ids: string[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/read`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du marquage des notifications comme lues:', error);
    throw error;
  }
};

export const markNotificationRead = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du marquage de la notification comme lue:', error);
    throw error;
  }
};
