import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare var feather: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {

  isMobileMenuOpen = false;
  isScrolled = false;

  constructor() {}

  ngAfterViewInit() {
    // Inicializa ícones
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  // Detecta scroll para adicionar sombra no header
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Fecha o menu ao clicar em um link
  closeMenu() {
    this.isMobileMenuOpen = false;
  }

  // NOVA FUNÇÃO: Rola até a seção com ajuste do menu fixo
  scrollToSection(sectionId: string) {
    this.closeMenu(); // Garante que fecha o menu mobile
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Altura do seu header fixo
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }
}