import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { SyntaxComponent } from "./syntax/syntax.component";
import { initFlowbite } from 'flowbite';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SyntaxComponent],
  template: `<app-syntax></app-syntax>`,
})
export class AppComponent implements OnInit {
  title = 'frontend-comments';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }
}
