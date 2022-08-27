import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalismanComponent } from './talisman.component';

describe('TalismanComponent', () => {
  let component: TalismanComponent;
  let fixture: ComponentFixture<TalismanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalismanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalismanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
