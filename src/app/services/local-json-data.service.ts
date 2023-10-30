import { Injectable } from '@angular/core';
import { default as pageConfig } from '../app-data-json/page-config.json';
import { default as productSearchFilterData } from '../app-data-json/product-search-filter-data.json';
import { default as countryListConfig } from '../app-data-json/country-list-config.json';
import { TLocalConfigDataPropNames } from '../models/app-data.model';

@Injectable({
  providedIn: 'root',
})
export class LocalJsonDataService {
  constructor() {}
  get<T>(dataType: TLocalConfigDataPropNames) {
    switch (dataType) {
      case 'pageConfig': {
        return (pageConfig as unknown) as T;
      }
      case 'productSearchFilterData': {
        return (productSearchFilterData as unknown) as T;
      }
      case 'countryListConfig': {
        return (countryListConfig as unknown) as T;
      }
    }
  }
}
