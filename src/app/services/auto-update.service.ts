import { Injectable } from '@angular/core';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';
import { EMPTY, from, Observable } from 'rxjs';
import { catchError, delay, switchMap } from 'rxjs/operators';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AutoUpdateService {
  
  updating: boolean; // Flag used for resuming the update when the app went to the background

  constructor(
    private deploy: Deploy,
    private utils: UtilsService
  ) { }

  /**
   * 
   * Update the app via IonicAppFlow
   * @param checkForUpdates 
   * @returns Observable<any>
   */
  update$(checkForUpdates = false): Observable<any> {
    return from(this.deploy.checkForUpdate()).pipe(
      switchMap((update) => {
        // Either it was 'manual/automatic' triggered, we check if there's an available version then update
        if (update?.available && !this.updating) {
          this.updating = true;
          return this.utils.showLoadingMask('Installing new version', 0).pipe(
            delay(700),
            switchMap(async (loadingElement: HTMLIonLoadingElement) => {
              
              // Download and apply the update in one step
              const latestVersion = await this.deploy.sync({ updateMethod: 'auto' }, (percentDone) => {
                loadingElement.message = `Installing new version. <br> Please keep the app running in the foreground. <br> Update is ${percentDone}% done! `;
              });
              loadingElement.message = `Your app has been updated.`;
              this.updating = false;
              
              // Reload the app, so there's no need to 'restart', this will also dismiss the loading
              return from(this.deploy.reloadApp()).pipe(delay(1000)); 
            }),
            catchError(() => {
              // If it was a manual' update, we notify to the user there was an error otherwise no notification is required
              if (checkForUpdates) {
                this.utils.dismissLoadingMask().subscribe();
                return this.utils.presentToast('There is a problem connecting with the server, please try again later', 2000, 'top');
              }
              this.updating = false;
            }),
          );
        } else if (checkForUpdates) {
          // No update available, but the process was triggered manually, so we notify to the users they're up-to-date of there was an error
          const message = update?.available === false
            ? 'Your Mobile App is up-to-date'
            : 'There is a problem connecting with the server, please try again later';
          return this.utils.presentToast(message, 2000, 'top');
        } else {
          // No update available, and process was triggrered on App start, no action needed
          return EMPTY;
        }
      }),
    );
  }

}
