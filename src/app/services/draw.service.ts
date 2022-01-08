import { ElementRef, Injectable } from "@angular/core";
import { interval } from "rxjs";
import { Vector } from 'ts-matrix';
import { Animal } from "../model/animal.model";
import { Bullet } from "../model/bullet.model";
import { Bunny } from "../model/bunny.model";
import { Deer } from "../model/deer.model";
import { Wolf } from "../model/wolf.model";
import { DataService } from "./data.service";

const INTERVAL_TIME = 200;

@Injectable({
    providedIn: 'root'
})
export class DrawService {
    private context: CanvasRenderingContext2D | null = null;
    private canvas!: ElementRef<HTMLCanvasElement>;
    private mousePosition: Vector | null = null;

    constructor(private dataService: DataService) {}

    public init(canvas: ElementRef<HTMLCanvasElement>): [number, number] {
        this.canvas = canvas;
        this.context = canvas.nativeElement.getContext('2d');

        this.addMouseEventListeners();
        this.startDrawingIteration();

        return [
            this.canvas.nativeElement.height,
            this.canvas.nativeElement.width
        ];
    }

    public clearCanvas(): void {
        this.context?.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientWidth);
    }

    private addMouseEventListeners(): void {
        const rect = this.canvas.nativeElement.getBoundingClientRect();
        this.canvas.nativeElement.addEventListener('mousemove', (e) => {
            if (this.mousePosition) this.mousePosition = new Vector(this.getMousePos(e, rect));
        });
        
        this.canvas.nativeElement.addEventListener(
            'mouseenter',
            (e) => (this.mousePosition = new Vector(this.getMousePos(e, rect)))
        );
        this.canvas.nativeElement.addEventListener('mouseleave', (e) => (this.mousePosition = null));
    }

    private startDrawingIteration() {
        interval(INTERVAL_TIME).subscribe((val) => {
            this.context?.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientWidth);
            this.context?.beginPath();
            
            this.dataService.animals.map((an: Animal) => {
                switch(an.type) {
                    case ("Wolf"): 
                        (an as Wolf).applyBehaviours(
                            this.dataService.animals,
                            this.dataService.greenAnimals,
                        );
                        (an as Wolf).addHunger();
                        break;
                    case ("Bunny"):
                        (an as Bunny).applyBehaviours(
                            this.dataService.greenAnimals.filter(a => a.id !== an.id),
                            this.dataService.hostileAnimals
                        );
                        break;
                    case ("Deer"): 
                        (an as Deer).applyBehaviours(
                            this.dataService.animals,
                            this.dataService.deers,
                            this.dataService.hostileAnimals,
                        );
                        break;
                }
                
                an.update();
                this.drawAnimal(an);
            });

            this.dataService.hunter?.bulletsArray.map((bul) => {
                this.drawBullet(bul);
                bul.update(this.dataService.animals);
            })
        });
    }

    private drawAnimal(entity: Animal): void {
        if (!this.context) return;
    
        this.context.fillStyle = entity.color;
        const [x, y] = entity.location.values;
        this.context.fillRect(x, y, 2, 2);
    }

    private drawBullet(entity: Bullet): void {
        if (!this.context) return;
    
        this.context.fillStyle = 'brown';
        const [x, y] = entity.location.values;
        this.context.fillRect(x, y, 1, 1);
    }

    private getMousePos(evt: MouseEvent, rect: DOMRect) {
        return [
            (evt.clientX - rect.left) / (rect.right - rect.left) * this.canvas.nativeElement.width,
            (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.nativeElement.height
        ];
    }
}