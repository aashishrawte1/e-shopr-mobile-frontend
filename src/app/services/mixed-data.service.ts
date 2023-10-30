import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { useSubject } from '../utils/useSubject';
import { IMixedDataResult } from '../models/IGetMixedDataResponse';

@Injectable({
  providedIn: 'root',
})
export class MixedDataGetterService {
  constructor(private apiService: ApiService) {}

  init() {}
  async getMixedData(data?: { tags?: string[]; table?: string[] }) {
    const { tags, table } = data || ({} as any);
    const response = await this.apiService.fetchMixedData({ tags, table });

    const { status, result } = response;
    const { code, description } = status;
    if (code !== 200) {
      console.error('fetch articles error', { description });
      return;
    }
    return result;
  }
}
