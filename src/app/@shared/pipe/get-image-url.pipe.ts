import { Pipe, PipeTransform } from "@angular/core";
import { catchError, map, of } from "rxjs";
import { CommonService } from "../services/common.service";

@Pipe({
  name: "getImageUrl",
  pure: true
})
export class GetImageUrlPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: string, defaultImageUrl?: string): any {
    if (!value) {
      return of(defaultImageUrl);
    }

    return this.commonService.getImageUrl(value).pipe(
      map((blob) => {
        return URL.createObjectURL(blob);
      }), 
      // catchError(() => {
      //   return defaultImageUrl
      // })
    );
  }
}
