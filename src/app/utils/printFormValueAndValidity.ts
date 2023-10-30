import { FormGroup } from '@angular/forms';

export const printFormValueAndValidity = (form: FormGroup) => {
  const controls = Object.keys(form.controls).map((k) => {
    return {
      controlName: k,
      value: form.controls[k].value,
      valid: form.controls[k].valid,
    };
  });
  console.log(controls);
};
