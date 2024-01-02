import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { urlConstant } from '../constant/urlConstant';
import { CommonService } from '../services/common.service';



import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomValidators {

  constructor() { }

  static isEmailUnique(commonService: CommonService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return timer(1000).pipe(
        switchMap(() => {
          return commonService.post(urlConstant.Auth.EmailExists, { email: control.value });
        }),
        map((res: any = {}) => {
          if (res?.status === 200 && res?.data?._id) {
            return { 'isEmailUnique': true };
          }

          return null;
        })
      );
    };
  }

  static isEmailExists(commonService: CommonService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return timer(1000).pipe(
        switchMap(() => {
          return commonService.post(urlConstant.Auth.EmailExists, { email: control.value });
        }),
        map((res: any = {}) => {
          if (res?.status === 200 && res?.data?._id) {
            return null;
          }

          return { 'isEmailExists': true };
        })
      );
    };
  }

  /**
   * isAlphabet is checked string is alphabet or not.
   *
   * @export
   * @param {AbstractControl} control
   * @returns {({ [key: string]: boolean } | null)} return data of result.
   */
  static isAlphabet(control: AbstractControl): { [key: string]: boolean } | null {
    const strRegEx = new RegExp('^[a-zA-Z ]+$');

    if (control.value !== undefined && !strRegEx.test(control.value)) {
      return { isAlphabet: true };
    }

    return null;
  }

  /**
   * isNumber is checked string is number or not.
   *
   * @export
   * @param {AbstractControl} control
   * @returns {({ [key: string]: boolean } | null)} return data of result.
   */
  static isNumber(control: AbstractControl): { [key: string]: boolean } | null {
    const strRegEx = new RegExp('^[0-9]+$');

    if (control.value !== undefined && !strRegEx.test(control.value)) {
      return { isNumber: true };
    }

    return null;
  }

  /**
   * isNumber is checked string is number or not.
   *
   * @export
   * @param {AbstractControl} control
   * @returns {({ [key: string]: boolean } | null)} return data of result.
   */
  static isNumberAndAlphabet(control: AbstractControl): { [key: string]: boolean } | null {
    const strRegEx = new RegExp('^[0-9a-zA-Z]+$');

    if (control.value !== undefined && !strRegEx.test(control.value)) {
      return { isNumberAndAlphabet: true };
    }

    return null;
  }

  /**
   * isNumber is checked string is number or blank.
   *
   * @export
   * @param {AbstractControl} control
   * @returns {({ [key: string]: boolean } | null)} return data of result.
   */
  static isNumberWithBlank(control: AbstractControl): { [key: string]: boolean } | null {
    const strRegEx = new RegExp('^[0-9]*$');

    if (control.value !== undefined && !strRegEx.test(control.value)) {
      return { isNumberWithBlank: true };
    }

    return null;
  }

  /**
   * isValidEmail is checked string is valid email or not.
   *
   * @export
   * @param {AbstractControl} control
   * @returns {({ [key: string]: boolean } | null)} return data of result.
   */

  static isDecimal(control: AbstractControl): { [key: string]: boolean } | null {
    const strRegEx = new RegExp(/^(\d*\.)?\d+$/);

    if (control.value !== undefined && !strRegEx.test(control.value)) {
      return { isDecimal: true };
    }

    return null;
  }

  /**
   * isValidEmail is checked string is valid email or not.
   *
   * @export
   * @param {AbstractControl} control
   * @returns {({ [key: string]: boolean } | null)} return data of result.
   */

  static isDecimalWithBlank(control: AbstractControl): { [key: string]: boolean } | null {
    const strRegEx = new RegExp(/^(\d*\.)?\d*$/);

    if (control.value !== undefined && !strRegEx.test(control.value)) {
      return { isDecimalWithBlank: true };
    }

    return null;
  }

  /**
   * Check the givent email valid or not.
   *
   * @export
   * @param {AbstractControl} control Pass cotral data.
   * @returns {({ [key: string]: boolean } | null)} return data of result.
   */
  static isValidEmail(control: AbstractControl): { [key: string]: boolean } | null {
    const strRegEx = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);

    if (control.value !== undefined && !strRegEx.test(control.value)) {
      return { isValidEmail: true };
    }

    return null;
  }
  /**
   * isPassword is checked string is valid Password or not.
   *
   * @export
   * @param {AbstractControl} control
   * @returns {({ [key: string]: boolean } | null)} return data of result.
   */
  static isPassword(control: AbstractControl): { [key: string]: boolean } | null {
    const strRegEx = new RegExp('^[a-zA-Z0-9_@]+$');

    if (control.value !== undefined && !strRegEx.test(control.value)) {
      return { isPassword: true };
    }
    return null;
  }

  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
}
