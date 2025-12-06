import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { ClinicaService } from '../../core/services/clinica.service'; // Importe o serviço

declare var feather: any;

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.css'
})
export class PrivateLayout implements OnInit, AfterViewInit {

  isMobileMenuOpen: boolean = false;

  // Objeto para guardar os dados vindos do serviço
  dadosClinica: any = {};

  constructor(
    private router: Router,
    private clinicaService: ClinicaService // Injete o serviço
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMobileMenuOpen = false;
      }
    });
  }

  ngOnInit() {
    // Inscreve-se para receber atualizações em tempo real
    this.clinicaService.dadosClinica$.subscribe(dados => {
      this.dadosClinica = dados;
    });
  }

  ngAfterViewInit() {
    if (typeof feather !== 'undefined') feather.replace();
  }

  toggleMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMenu() { this.isMobileMenuOpen = false; }
}