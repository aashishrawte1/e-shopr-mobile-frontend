import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  constructor(private storeService: StoreService) {}

  createSessionId() {
    this.storeService.userSessionId = nanoid();
  }
}
