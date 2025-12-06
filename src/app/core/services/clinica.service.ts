import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {

  // --- ESTADO GLOBAL DA CLÍNICA ---
  // Usamos BehaviorSubject para que quem assinar receba o valor atual imediatamente
  private dadosClinicaSubject = new BehaviorSubject<any>({
    nome: 'ClinicaPi',
    logo: 'https://ui-avatars.com/api/?name=Clinica+Pi&background=00A896&color=fff&rounded=true&size=64',
    cnpj: '00.000.000/0001-00',
    endereco: 'Rua das Flores, 123, Uberlândia - MG'
  });

  dadosClinica$ = this.dadosClinicaSubject.asObservable();

  constructor() {}

  // Método para atualizar dados (chamado pela tela de Configurações)
  atualizarDados(novosDados: any) {
    this.dadosClinicaSubject.next(novosDados);
  }

  // Método para atualizar apenas o Logo (preview)
  atualizarLogo(urlLogo: string) {
    const dadosAtuais = this.dadosClinicaSubject.getValue();
    this.dadosClinicaSubject.next({ ...dadosAtuais, logo: urlLogo });
  }
}