import { Component } from '@angular/core';
import { AutoUpdateService } from '../services/auto-update.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  updating: boolean;
  versionInfo;

  constructor(
    private autoUpdateService: AutoUpdateService
  ) {}

  update() {
    if (!this.updating) {
      this.updating = true;

      this.autoUpdateService.update$(true).subscribe((res) => {
        setTimeout(() => {
          this.updating = false;
        }, 1000);
      });
    }
  }

}
