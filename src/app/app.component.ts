import { NgClass } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-root',
  imports: [NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isScrolled = false;
  activeSection = 'About';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10; 
  }

  onClick(section: string){
    this.activeSection = section;
  }
}