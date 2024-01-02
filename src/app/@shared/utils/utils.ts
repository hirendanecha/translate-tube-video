import { FormGroup } from "@angular/forms";

export const slugify = (str: string) => {
  return str?.length > 0 ? str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') : '';
}

export const numToRevArray = (num: number) => {
  return Array(num).fill(0).map((x,i)=>i).reverse();
}

export const  isFormSubmittedAndError = (formGroup: FormGroup, isFormSubmitted: boolean, controlName: string, errorName: string = '', notError: Array<string> = new Array()): any => {
  const otherError: any = formGroup.controls[controlName].errors;

  if (isFormSubmitted && otherError) {
      return errorName == '' ? true : (otherError ? !Object.keys(otherError).some(err => notError.includes(err)) : true) ? formGroup.controls[controlName].hasError(errorName) : false;
  }
  return false;
}

export const getTagUsersFromAnchorTags = (anchorTags: any[]): any[] => {
  const tags = [];
  for (const key in anchorTags) {
    if (Object.prototype.hasOwnProperty.call(anchorTags, key)) {
      const tag = anchorTags[key];

      tags.push({
        id: tag?.getAttribute('data-id'),
        name: tag?.innerHTML,
      });
    }
  }

  return tags;
}

export const deleteExtraParamsFromReqObj = (reqObj: any): any => {
  delete reqObj?.['isClicked'];
  delete reqObj?.['isSubmitted'];

  return reqObj;
}
