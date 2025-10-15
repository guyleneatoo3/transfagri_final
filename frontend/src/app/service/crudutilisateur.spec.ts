import { TestBed } from '@angular/core/testing';

import { CRUDUtilisateur } from './crudutilisateur';

describe('CRUDUtilisateur', () => {
  let service: CRUDUtilisateur;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CRUDUtilisateur);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
