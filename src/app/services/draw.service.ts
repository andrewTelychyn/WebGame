import { ElementRef, Injectable } from "@angular/core";
import { interval } from "rxjs";
import { filter } from "rxjs/operators";
import { Vector } from 'ts-matrix';
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
        interval(INTERVAL_TIME)
            .pipe(
                filter(() => !this.dataService.isStopGame)
            )
            .subscribe((val) => {

            this.context?.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientWidth);
            this.context?.beginPath();
            
            this.dataService.updateIteration(this.drawEntity.bind(this));
        });
    }

    private drawEntity(entity: any, size: number = 2): void {
        if (!this.context) return;
    
        this.context.fillStyle = entity.color;
        const [x, y] = entity.location.values;
        this.context.fillRect(x, y, size, size);
    }

    private getMousePos(evt: MouseEvent, rect: DOMRect) {
        return [
            (evt.clientX - rect.left) / (rect.right - rect.left) * this.canvas.nativeElement.width,
            (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.nativeElement.height
        ];
    }
}