import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteDetalhe } from './paciente-detalhe';

describe('PacienteDetalhe', () => {
  let component: PacienteDetalhe;
  let fixture: ComponentFixture<PacienteDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
