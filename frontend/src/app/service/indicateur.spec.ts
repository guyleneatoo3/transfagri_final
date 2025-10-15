import { TestBed } from '@angular/core/testing';

import { Indicateur } from './indicateur';

describe('Indicateur', () => {
  let service: Indicateur;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Indicateur);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
