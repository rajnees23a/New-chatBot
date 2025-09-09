import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-first-time-user',
  templateUrl: './first-time-user.component.html',
  styleUrls: ['./first-time-user.component.css']
})
export class FirstTimeUserComponent implements OnInit{

  @Output() booleanValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  createNew: boolean = true;
  isPopupVisible: boolean = false;
  userComeFirstTime = true;

    currentStep: number = 1;
  comingFromCreatDirectly: boolean = false;
  @Input() childData: string = '';
  showOnlyPopup: boolean= false;

    constructor(private route: ActivatedRoute,private router: Router) {

    }


    // Steps data
    steps = [
        {
            title: "Let's create something amazing together 🎉",
            description: 'How it works?',
            list: [
                'Our ADA will guide you through the submission process.',
                'You will be asked questions about your project idea.',
                'The form on the right will be automatically populated as you chat with ADA.',
                'You can review and edit your response at any time.',
            ],
        },
        {
            title: 'Key questions you must answer',
            description: "To begin, you'll need to complete these essential fields",
            list: [
                'Problem statement',
                'Objective',
                'Key results',
                'Urgency',
                'Areas involved',
                'Destination 2027 alignment',
                'Risks',
            ],
        },
        {
            title: 'Additional fields to enhance your idea',
            description:
                'Adding additional details can help make your submission more compelling and comprehensive. These optional fields are divided into two sections.',
            list: [
                'Part 1: Metrics and details',
                'KPIs, Key features, Dependencies, Timelines, Budget details',
                'Part 2: Stakeholders and alignment',
                'Stakeholders, IT sponsor, Additional comments',
            ],
        },
        {
            title: 'Tips for a strong submission',
            description: '',
            list: [
                'Be clear and specific about the problem your idea solves.',
                'Define measurable objectives and key results.',
                'Include stakeholders and consider their roles in implementation.',
                'Ensure alignment with strategic goals, such as Destination 2027.',
            ],
        },
    ];

    isLastSlideReached: boolean = false;
    totalSlides: number = 0;
  currentSlideIndex: number = 0;

    ngOnInit(){
      if(sessionStorage.getItem('userFirstTime') && sessionStorage.getItem('userFirstTime') == 'false'){
        this.userComeFirstTime = false;
      }
    }


  



    prevStep(): void {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    getStarted(): void {
        this.closePopup();
        this.createNew = false;
        this.booleanValue.emit(this.createNew);
        sessionStorage.setItem('userFirstTime','false');
    }


  createButton() {
     // Emit the boolean value to the parent
    this.isPopupVisible = true;
  }



  showCarousel = false;
  step = 1;

  openPopup(): void {
    if(this.userComeFirstTime == true){
      this.showCarousel = true;
    }else{
      this.router.navigate(['/create']);
    }
  }

  openPopupOnClick(): void {
    this.showOnlyPopup = true;
  }

  nextStep(): void {
    if (this.step < 4) this.step++;
  }

  previousStep(): void {
    if (this.step > 1) this.step--;
  }

  closePopup(): void {
    this.showCarousel = false;
    this.step = 1;
    this.createNew = false;
        this.booleanValue.emit(this.createNew);
  }

  get progressValue() {
    return (this.step - 1) * 33;
  }


}
