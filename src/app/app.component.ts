import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import { Vector } from 'ts-matrix';
import { Animal } from './model/animal.model';
import { Bunny } from './model/bunny.model';
import { Deer } from './model/deer.model';
import { Wolf } from './model/wolf.model';

const MIN_DEERS = 3;
const MAX_DEERS = 10;
const MIN_BUNNIES = 2;
const MAX_BUNNIES = 5;
const MIN_WOLVES = 0;
const MAX_WOLVES = 2;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  
  public title = 'practice6';
  public context: CanvasRenderingContext2D | null = null;
  public mousePosition: Vector | null = null;

  public animals: Animal[] = [];
  public deers: Deer[] = [];
  public bunnies: Deer[] = [];
  public wolves: Deer[] = [];

  public canvasHeight!: number;
  public canvasWidth!: number;

  public ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');

    interval(200).subscribe((val) => {
      this.context?.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientWidth);
      this.context?.beginPath();
      this.animals = this.animals.filter((an: Animal) => {
        
        switch(an.type) {
          case ("Wolf"): 
            (an as Wolf).applyBehaviours(this.bunnies.concat(this.deers));
            break;
          case ("Bunny"):
            (an as Bunny).applyBehaviours(this.animals.filter(a => a.id !== an.id));
            break;
          case ("Deer"): 
            (an as Deer).applyBehaviours(this.animals, this.deers, this.wolves);
            break;
          }
          
        an.update();
        this.drawAnimal(an);
        return this.checkEdges(an); 
      });
    });
    
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.addEventListener('mousemove', (e) => {
      if (this.mousePosition) this.mousePosition = new Vector(this.getMousePos(e, rect));
    });
    
    this.canvas.nativeElement.addEventListener('mouseenter', (e) => (this.mousePosition = new Vector(this.getMousePos(e, rect))));
    this.canvas.nativeElement.addEventListener('mouseleave', (e) => (this.mousePosition = null));

    this.canvasHeight = this.canvas.nativeElement.height;
    this.canvasWidth = this.canvas.nativeElement.width;
    this.initData();
  }

  public checkEdges(animal: Animal): boolean {
    let [x, y] = animal.location.values;
    const value = !(x < 0 || x > this.canvasWidth || y < 0 || y > this.canvasHeight)
    if (!value) {
      this.bunnies = this.bunnies.filter(i => i.id !== animal.id);
      this.deers = this.deers.filter(i => i.id !== animal.id);
      this.wolves = this.wolves.filter(i => i.id !== animal.id);
    }

    return value;
  }

  public addAnimal(): void {
    const animal = new Animal(
        Math.random() * this.canvasWidth,
        Math.random() * this.canvasHeight,
        this.canvasHeight,
        this.canvasWidth,
      );
    this.animals.push(animal);
  }

  public stop(): void {
    this.context?.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientWidth);
    this.animals = []
  }

  private initData(): void {

    console.log(this.animals.length);
    const deerAmount = Math.round(Math.random() * (MAX_DEERS - MIN_DEERS) + MIN_DEERS)
    for(let i = 0; i < deerAmount; i++) {
      const deer = new Deer(
        Math.random() * this.canvasWidth,
        Math.random() * this.canvasHeight,
        this.canvasHeight,
        this.canvasWidth,
      );
      this.animals.push(deer);
      this.deers.push(deer);
    }

    const bunnyAmount = Math.round(Math.random() * (MAX_BUNNIES - MIN_BUNNIES) + MIN_BUNNIES)
    for(let i = 0; i < bunnyAmount; i++) {
      const bunny = new Bunny(
        Math.random() * this.canvasWidth,
        Math.random() * this.canvasHeight,
        this.canvasHeight,
        this.canvasWidth,
      );
      this.animals.push(bunny);
      this.bunnies.push(bunny);
    }

    const wolvesAmount = Math.round(Math.random() * (MAX_WOLVES - MIN_WOLVES) + MIN_WOLVES)
    for(let i = 0; i < wolvesAmount; i++) {
      const wolf = new Wolf(
        Math.random() * this.canvasWidth,
        Math.random() * this.canvasHeight,
        this.canvasHeight,
        this.canvasWidth,
      );
      this.animals.push(wolf);
      this.wolves.push(wolf);
    }
    console.log(this.animals.length);
  }
  
  private drawAnimal(animal: Animal): void {
    if (!this.context) return;

    this.context.fillStyle = animal.color;
    const [x, y] = animal.location.values;
    this.context.fillRect(x, y, 2, 2);
  }

  private getMousePos(evt: MouseEvent, rect: DOMRect) {
    return [
        (evt.clientX - rect.left) / (rect.right - rect.left) * this.canvas.nativeElement.width,
        (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.nativeElement.height
    ];
  }
}
