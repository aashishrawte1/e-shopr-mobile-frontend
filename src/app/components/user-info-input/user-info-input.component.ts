import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  EMAIL_REGEX,
  NAME_REGEX,
  NUMBER_REGEX,
  PHONE_NUMBER_REGEX,
} from '../../constants';
import { printFormValueAndValidity } from '../../utils/printFormValueAndValidity';

@Component({
  selector: 'user-portal-user-info-input',
  templateUrl: './user-info-input.component.html',
  styleUrls: ['./user-info-input.component.scss'],
})
export class UserInfoInputComponent {
  // Data passed in by componentProps
  @Input() askForEmail: boolean;
  @Input() askForPhone: boolean;
  @Input() askForFullName: boolean;
  isFormValid = false;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    const inputs = {};
    if (this.askForEmail) {
      inputs['email'] = ['', [Validators.required, Validators.email]];
    }

    if (this.askForPhone) {
      inputs['phoneWithCountryCode'] = this.formBuilder.group({
        code: [''],
        number: [''],
      });
    }

    if (this.askForFullName) {
      inputs['fullName'] = ['', [Validators.required]];
    }

    this.form = this.formBuilder.group(inputs);
  }

  get email(): any {
    return this.form.controls.email;
  }

  get code(): any {
    return this.form.controls.phoneWithCountryCode?.get('code');
  }
  get phone(): any {
    return this.form.controls.phoneWithCountryCode;
  }

  get number(): any {
    return this.form.controls.phoneWithCountryCode?.get('number');
  }

  get fullName(): any {
    return this.form.controls.fullName;
  }

  onSubmit() {
    if (!this.checkIfFormIsValid()) {
      return;
    }
    if (this.askForFullName && !NAME_REGEX.test(this.fullName?.value)) {
      return;
    }

    this.modalController.dismiss(this.form.value);
  }

  checkIfFormIsValid() {
    if (this.form.invalid) {
      return false;
    }

    if (this.askForEmail && !EMAIL_REGEX.test(this.email.value || '')) {
      return false;
    }

    if (
      this.askForPhone &&
      (this.number?.value || this.code?.value) &&
      !(
        PHONE_NUMBER_REGEX.test((this.number?.value || 0).toString()) &&
        NUMBER_REGEX.test((this.code?.value || 0).toString())
      )
    ) {
      return false;
    }

    return true;
  }
}
