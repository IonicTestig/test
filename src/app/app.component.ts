import { Component } from '@angular/core';
import { AutoUpdateService } from './services/auto-update.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private autoUpdateService: AutoUpdateService
  ) {
  }

  ngOnInit(){
    this.platform.ready().then(()=>{
      this.setUpdateListener();
      this.autoUpdateService.update$().subscribe();
    });
  }

  setUpdateListener() {
    document.addEventListener('resume', () => {
      this.autoUpdateService.update$().subscribe();
    });
  }

}
