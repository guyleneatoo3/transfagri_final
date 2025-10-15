import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaccueilComponent } from './haccueil';

describe('HaccueilComponent', () => {
  let component: HaccueilComponent;
  let fixture: ComponentFixture<HaccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaccueilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HaccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
