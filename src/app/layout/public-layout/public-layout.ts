import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <--- Importante

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet], // <--- Adicione isso
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css'
})
export class PublicLayout { // Nome da classe conforme sua estrutura
}