import { Component } from '@angular/core';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'online-shop';

  constructor(public loaderService: LoaderService) {
  }
}
