import { ComponentFixture, TestBed } from '@angular/core/testing';

// Correct the import path to match the actual file exporting Upload
// Update the import path to the correct location of the Formation component
// Update the path below to the actual location of formation.component.ts
import { Formation } from './formation/formation.component';

describe('Upload', () => {
  let component: Formation;
  let fixture: ComponentFixture<Formation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formation],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
