import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { IMedia } from '../models';
import { ApiService } from './api.service';
import { AppService } from './app.service';
import { StoreService } from './store.service';
import { async } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(
    private afAuth: AngularFireAuth,
    private apiService: ApiService,
    private appService: AppService,
    private afStorage: AngularFireStorage,
    private storeService: StoreService
  ) {}

  async init() {
    this.storeService.authFirebaseUser.data.subscribe((_) => {
      this.syncMyProfile();
    });
    return true;
  }

  async syncMyProfile() {
    const uid = (this.storeService.authFirebaseUser.data.value || {}).uid;
    if (!uid) {
      this.storeService.loggedInUser.next(null);
      return;
    }
    const user = (await this.apiService.fetchMyProfile({ uid })).result;
    if (!!!user) {
      return;
    }
    const latestProfile = {
      ...user,
      uid,
    };
    this.storeService.loggedInUser.next(latestProfile);
    this.setCurrencyInfo();
  }

  async addProfilePicture() {
    const image = await this.appService.getImage({
      quality: 70,
      height: 200,
      width: 200,
    });
    await this.appService.showLoader();
    const mediaData = await this.uploadMediaToFirebase({ images: [image] });
    const response = await this.apiService.addProfileToDb({
      image: mediaData[0],
    });
    this.syncMyProfile();
    return response;
  }

  async uploadMediaToFirebase({
    images,
  }: {
    images: string[];
  }): Promise<IMedia[]> {
    const userUid = this.storeService.loggedInUser.value.uid;
    const promises = images.map(
      async (image): Promise<IMedia> => {
        const afRef = this.afStorage.ref(
          `/users/${userUid}/${new Date().valueOf()}`
        );
        const snap = await afRef.putString(
          image.replace('data:image/jpeg;base64,', ''),
          'base64',
          {
            contentType: 'image/jpeg',
          }
        );
        const imageUrl = await snap.ref.getDownloadURL();

        return {
          type: 'image',
          link: imageUrl,
        };
      }
    );
    return await Promise.all(promises);
  }

  async updateLastLogin() {
    const response = await this.apiService.updateLastLogin();
    return response;
  }

  async updateFullName({ fullName }: { fullName: string }) {
    const response = await this.apiService.updateFullName({ fullName });
    this.syncMyProfile();
    return response;
  }

  async updatePhone(phoneComponents: { code: number; number: number }) {
    const response = await this.apiService.updatePhone({
      code: phoneComponents.code,
      number: phoneComponents.number,
    });
    this.syncMyProfile();
    return response;
  }

  async updateEmail({ email }: { email: string }) {
    var userInFirebase = this.afAuth.currentUser;

    const res = (await userInFirebase)
      .updateEmail(email)
      .then(async () => {
        // Update successful.
        console.log('Email updated');
        await this.apiService.updateEmail({
          email: email,
        });
        this.syncMyProfile();
      })
      .catch((error) => {
        // An error happened.
        console.log('Error updating email', error);
        return error;
      });

    return res;
  }

  async updateCountry(data: { country: string }) {
    await this.apiService.updateCountry({ data });
    this.syncMyProfile();
    return true;
  }

  getUsersCountry() {
    return (
      this.storeService.loggedInUser.value?.country ||
      this.storeService.json.countryListConfig.value.defaultSelection
    );
  }

  getCountryCode() {
    const usersCountry = this.getUsersCountry();
    return this.appService.getCountrySpecificProp({
      propName: 'countryName',
      propToGet: 'countryCode',
      valueToCompare: usersCountry,
    });
  }

  setCurrencyInfo() {
    const usersCountry = this.getUsersCountry();
    this.storeService.appCurrencyFormat = this.appService.getCountrySpecificProp(
      {
        propName: 'countryName',
        propToGet: 'currencyFormat',
        valueToCompare: usersCountry,
      }
    );
  }
}
