import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators'
import { DataService } from './services/data.service';
import { DrawService } from './services/draw.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  
  public title = 'practice6';

  constructor(private drawService: DrawService, private dataService: DataService) {
    this.initKeyboardEvents();
  }

  public ngAfterViewInit(): void {
    const [height, width] = this.drawService.init(this.canvas);
    this.dataService.initRanges(width, height);
  }

  private initKeyboardEvents(): void {
    fromEvent(document, 'keydown')/*.pipe(debounceTime(200))*/.subscribe((key: any) => {
      // console.log(key)
      this.dataService.keyPressHandler(key.key);
    })
  }

  public addAnimal(): void {
    this.dataService.initData();
  }

  public addWolf() {
    this.dataService.addWolf();
  }

  public addDeer() {
    this.dataService.addDeer();
  }

  public addBunny() {
    this.dataService.addBunny();
  }

  public stop(): void {
    this.dataService.emptyData();
  }
}
