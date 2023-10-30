import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

export class BarteringModifyProductFormValidators {
  static minPriceShouldBeLesserThanMaxPrice(
    control: AbstractControl
  ): ValidationErrors {
    if (!control.parent?.controls) {
      return null;
    }
    const minPrice = +(control.value || 0);

    const maxPriceControl = control.parent.get('priceMax');
    const maxPrice = +(maxPriceControl.value || 0);

    if (minPrice > maxPrice) {
      return {
        minPriceShouldBeLesserThanMaxPrice: true,
      };
    }

    maxPriceControl.setErrors(null);
    maxPriceControl.markAsDirty();
    return null;
  }

  static maxPriceShouldBeGreaterThanMinPrice(
    control: AbstractControl
  ): ValidationErrors {
    if (!control.parent?.controls) {
      return null;
    }
    const maxPrice = +(control.value || 0);

    const minPriceControl = control.parent.get('priceMin');
    const minPrice = +(minPriceControl.value || 0);

    if (maxPrice < minPrice) {
      return {
        maxPriceShouldBeGreaterThanMinPrice: true,
      };
    }

    minPriceControl.setErrors(null);
    minPriceControl.markAsDirty();

    return null;
  }
}
