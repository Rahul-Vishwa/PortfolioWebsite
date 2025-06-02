import { NgClass, ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

interface Form {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  message: FormControl<string | null>;
}

type ContactForm = FormGroup<Form>;

@Component({
  selector: 'app-root',
  imports: [
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  isScrolled = false;
  activeSection = 'About';
  @ViewChildren('sectionRef') sections!: QueryList<ElementRef>;   
  showHis = false;
  showAppointo = false;
  dropdown = false;
  options = ['About', 'Services', 'Projects', 'Testimonials', 'Blogs', 'Contact'];
  @ViewChild('dropdownRef') dropdownRef:ElementRef<HTMLElement>|undefined;
  form!:ContactForm;
  subscription = new Subscription();
    
  constructor(
    private scroller: ViewportScroller,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    Aos.init({
      duration: 1000,
      once: true
    });

    this.form = new FormGroup({
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s'-]+$/)]),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      message: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
    });
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) {
              this.activeSection = id;
            }
          }
        });
      },
      { threshold: 0.2 }
    );


    this.sections.forEach((section) => {
      observer.observe(section.nativeElement);
    });
  }

  scrollTo(anchor: string) {
    this.scroller.scrollToAnchor(anchor);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }
 
  @HostListener('document:click', ['$event.target'])
  public onMouseClick(target: HTMLElement) {
    const clickedInside = this.dropdownRef?.nativeElement.contains(target);
    if (!clickedInside) {
      this.dropdown = false;
    }
  }

  onClick(section: string){
    this.activeSection = section;
  }

  toggleDropdown(){
    this.dropdown = !this.dropdown;
  }

  submit(){
    if (this.form.valid){
      this.subscription.add(
        this.http.post('https://formspree.io/f/xblyrppd', this.form.value)
        .subscribe((result:any)=>{
          if (result.ok){
            alert('Message has been sent. Thank You.');
            this.form.reset();
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}