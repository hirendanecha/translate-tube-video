'use strict';
;
import { FormGroup } from '@angular/forms';
/**
 * This component is used to modified local data
 *
 * @export
 * @class Globals
 */
export class Globals {
    /**
     * Build form data.
     *
     * @static
     * @param {*} formData Pass form data.
     * @param {*} data Pass data from parent component.
     * @param {*} [parentKey=null] Pass parent key data.
     * @memberof Globals
     */
    static buildFormData(formData: any, data: any, parentKey: any = null): void {
        // console.log('data typeof : ', data, typeof data);

        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach(key => {
                if (data[key] instanceof File) {
                    this.buildFormData(formData, data[key], parentKey ? parentKey : key);
                } else {
                    this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
                }
            });
        } else {
            const value = data == null ? '' : data;

            formData.append(parentKey, value);
        }
    }

    /**
     * Convert json to form data.
     *
     * @static
     * @param {*} data Pass data from parent component.
     * @returns {FormData} Return data of form data.
     * @memberof Globals
     */
    static jsonToFormData(data: any): FormData {
        const formData = new FormData();
        this.buildFormData(formData, data);
        return formData;
    }

    /**
     * Convert string to init.
     *
     * @static
     * @param {string} num pass string number.
     * @returns {number} Return data of number type.
     * @memberof Globals
     */
    static strToInt(num: string): number {
        return parseInt(num, 10);
    }

    /**
     * Convert birth date to age.
     *
     * @static
     * @param {string} dob
     * @returns {number}
     * @memberof Globals
     */
    static findAge(dob: string): number {
        const timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
        return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    }

    /**
     * Array to json with key.
     *
     * @static
     * @param {string} idField pass id field
     * @param {*} datas Pass datas.
     * @returns {*} Return converted data.
     * @memberof Globals
     */
    // static arrayToJsonWithKey(idField: any, datas: any): any {
    //     const tempData = new Array();

    //     for (const data of datas) {
    //       const obj =  {};
    //       obj[idField] = data;

    //       tempData.push(obj);
    //     }

    //     return tempData;
    // }

    /**
     * Play audio
     *
     * @static
     * @memberof Globals
     */
    static playAudio(): void {
        const audio = new Audio();
        audio.src = '../../../assets/audio/alarm.wav';
        audio.load();
        audio.play();
    }

    /**
     * Show a error message.
     *
     * @static
     * @param {*} errorObj Pass error page data.
     * @returns {string}
     * @memberof Globals
     */
    static errorMsgs(errorObj: any): string {
        let errMsgs = '';
        for (const key in errorObj) {
            if (errorObj.hasOwnProperty(key)) {
                const filed = key.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                errMsgs += filed + ' ' + errorObj[key] + '\n';
            }
        }
        return errMsgs;
    }

    /**
     * Formate date in 12 hour.
     *
     * @static
     * @param {string} strDate pass String data.
     * @returns {string} Return data.
     * @memberof Globals
     */
    static formatDateIn12Hours(strDate: string): string {

        if (Date.parse(strDate)) {
            const date = new Date(strDate);
            let hours = date.getUTCHours();
            let minutes = date.getUTCMinutes().toString();
            const amPm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = parseInt(minutes, 0) < 10 ? '0' + minutes : minutes;

            return hours + ':' + minutes + ' ' + amPm;
        } else {
            return strDate;
        }
    }

    /**
   * This function is used to validate positive number.
   *
   * @param index Pass drug index.
   */
    static validatePositiveNumber(event: any): any {
        var p = event.target.value + event.key;

        var s = p.match(/^(\d+(\.\d{0,1})?|\.?\d{1})$/) != null;
        if (!s && event.keyCode !== 8 && event.keyCode !== 9) {
        event.stopPropagation();
        return false;
        }
    }


    /**
     * Set paths for selected event.
     *
     * @param {*} path object as string
     * @memberof PatientListComponent
    */
    static setLocalStoragePaths(path: string): void {
        var data = Object.assign(JSON.parse(localStorage.getItem('path') || '') || {}, JSON.parse(path));
        localStorage.setItem('path', JSON.stringify(data));
    }

    /**
     * Set paths for selected event.
     *
     * @param {*} base64, fileName
     * @memberof Globals
    */
    static base64toFile(base64: string, fileName: string) {
        var arr = base64.split(','),
            mime = arr[0].match(/:(.*?);/)![1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], fileName, {type:mime});
    }



    static fileToBase64(file: File): any {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
              resolve(reader.result)
          };
          reader.onerror = error => reject(error);
        });
    }

    static fileToBlobUrl(file: File): any {
        return new Promise((resolve, reject) => {
            resolve(URL.createObjectURL(file));
        });
    }

    static blobToBase64(file: Blob): any {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
              resolve(reader.result)
          };
          reader.onerror = error => reject(error);
        });
    }

    static downloadBase64File(base64: string, fileName: string = 'sample'): void {
        fetch(base64)
        .then(res => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
        })
    }


    // static validateAllFormFields(formGroup: FormGroup) {
    //     Object.keys(formGroup.controls).forEach(field => {
    //         const control = formGroup.get(field);

    //         if (control instanceof FormControl) {
    //             console.log(field, control ,control.errors);
    //             control.markAsTouched();
    //         } else if (control instanceof FormGroup) {
    //             this.validateAllFormFields(control);
    //         } else if (control instanceof FormArray) {
    //             control.controls.forEach((ctrlGroup: FormGroup) => {
    //                 this.validateAllFormFields(ctrlGroup);
    //             });
    //         }
    //     });
    // }

    static isFormSubmittedAndError(formGroup: FormGroup, isFormSubmitted: number, controlName: string, errorName: string = '', notError: Array<string> = new Array()): any {
        const otherError: any = formGroup.controls[controlName].errors;
        // if(otherError) {
        //     console.log(controlName, otherError);
        // }

        if (isFormSubmitted && otherError) {
            return errorName == '' ? true : (otherError ? !Object.keys(otherError).some(err => notError.includes(err)) : true) ? formGroup.controls[controlName].hasError(errorName) : false;
        }
        return false;
    }

    static jsonToQueryString(params: any = {}): string {
        return Object.keys(params).map(function(key) {
            return key + '=' + params[key]
        }).join('&');
    }

    static splitCountryCode(phoneNumber: string = ''): string {
        return phoneNumber ? phoneNumber.substring(phoneNumber.indexOf(' '), phoneNumber.length) : '';;
    }

    // static rememberMe(isRememberMe: boolean, params: any = {}): void {
    //     if(isRememberMe && params && params['username'] && params['password']) {
    //         // localStorage.setItem('me', );
    //     } else {
    //         localStorage.removeItem('me');
    //     }
    // }

    static createArrayRange(start: number, end: number): Array<number> {
        return Array(end - start + 1).fill('').map((_, idx) => start + idx)
    }
}
