// On importe les outils nécessaires pour tester un composant Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// On importe le composant que l'on souhaite tester
import { LoginComponent } from './login.component'; // ← bon import

// On définit un bloc de test pour le composant LoginComponent
describe('LoginComponent', () => {
  // Déclaration des variables pour manipuler le composant et son environnement de test
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Ce bloc s'exécute avant chaque test
  beforeEach(async () => {
    // On configure un module de test Angular avec le composant à tester
    await TestBed.configureTestingModule({
      declarations: [LoginComponent] // On déclare le composant ici
    }).compileComponents(); // On compile le template HTML et CSS du composant

    // On crée une instance du composant et on récupère son objet
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // On déclenche la détection de changements pour mettre à jour le DOM
    fixture.detectChanges();
  });

  // Test simple : vérifier que le composant est bien créé
  it('should create', () => {
    expect(component).toBeTruthy(); // Le composant doit exister (pas null ou undefined)
  });
});
