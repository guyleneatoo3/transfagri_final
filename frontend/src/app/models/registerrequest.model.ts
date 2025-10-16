  // Assurez-vous d'importer correctement le modèle de rôle si nécessaire

export interface RegisterRequest {
  email: string;
  motdepasse: string;
  role: string; // e.g., "ROLE_ADMIN" or "ROLE_CNEF"
  nom: string;
}