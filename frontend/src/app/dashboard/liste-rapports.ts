import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Rapport {
  id: number;
  titre: string;
  date: string;
  url: string;
}

@Component({
  selector: 'app-liste-rapports',
  templateUrl: './liste-rapports.html',
  styleUrls: ['./liste-rapports.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ListeRapportsComponent {
  rapports: Rapport[] = [
    { id: 1, titre: 'Rapport Janvier', date: '01/02/2025', url: '#' },
    { id: 2, titre: 'Rapport Février', date: '01/03/2025', url: '#' }
  ];
}