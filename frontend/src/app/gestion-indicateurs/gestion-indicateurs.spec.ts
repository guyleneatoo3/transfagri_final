import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionIndicateursComponent } from './gestion-indicateurs';

describe('GestionIndicateurs', () => {
  let component: GestionIndicateursComponent;
  let fixture: ComponentFixture<GestionIndicateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionIndicateursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionIndicateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
