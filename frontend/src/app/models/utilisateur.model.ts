export class Utilisateur {
  id?: number;
  nom!: string;
  email!: string;
  motDePasse!: string;
  static email: any;

  constructor(init?: Partial<Utilisateur>) {
    Object.assign(this, init);
  }
}
