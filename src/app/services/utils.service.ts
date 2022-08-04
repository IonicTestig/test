import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
  ) { }

  showLoadingMask(message = 'Loading...', defaultTime = 2000) {
    return from(
      this.loadingCtrl.create({
        spinner: 'crescent',
        message,
        duration: defaultTime,
        mode: 'ios',
      }),
    ).pipe(
      tap((mask) => {
        mask.present();
        return mask;
      }),
    );
  }

  presentToast(message: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle' = 'middle') {
    const options = {
      message,
      position,
      duration,
    };
    return from(this.toastController.create(options)).pipe(switchMap((toast) => from(toast.present())));
  }

  dismissLoadingMask() {
    return from(this.loadingCtrl.getTop()).pipe(
      filter((overlay) => !!overlay),
      switchMap(() => this.loadingCtrl.dismiss()),
    );
  }
}
