import { Injectable } from '@angular/core';
import { IRange } from '../models';
import { ApiService } from './api.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(
    private apiService: ApiService,
    private storeService: StoreService
  ) {}

  async fetchArticles(range: IRange) {
    const response = await this.apiService.fetchManyArticle({
      start: range.start,
      end: range.end,
    });
    const { status, result } = response;
    const { code, description } = status;
    if (code !== 200) {
      console.error('fetch articles error', { description });
      return;
    }

    this.storeService.articles.next(result);
    return result;
  }

  async getPopularArticles() {
    return this.storeService.articles.getValue() || [];
  }
}
