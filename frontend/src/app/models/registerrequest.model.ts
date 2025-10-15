  // Assurez-vous d'importer correctement le modèle de rôle si nécessaire

export interface RegisterRequest {
    
    email: string;
    motdepasse: string;
    role: Role|null;  // Assurez-vous que le modèle Role est correctement défini dans votre application
}

export enum Role {
    ROLE_ADMIN = 'ADMIN',
    ROLE_CNEF = 'CNEF',
    ROLE_EMF = 'EMF',
    ROLE_PASNFI = 'PASNFI',
    // Ajoutez d'autres rôles selon votre modèle
  }