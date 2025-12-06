import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProntuarioDetalhe } from './prontuario-detalhe';

describe('ProntuarioDetalhe', () => {
  let component: ProntuarioDetalhe;
  let fixture: ComponentFixture<ProntuarioDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProntuarioDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProntuarioDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
