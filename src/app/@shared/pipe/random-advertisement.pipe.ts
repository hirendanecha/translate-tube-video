import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomAdvertisementUrl'
})
export class RandomAdvertisementUrlPipe implements PipeTransform {
  transform(advertisementDataList: any[], index: number): any[] {
    // if (advertisementDataList?.length > 0) {
    //   const adjustedIndex = index % advertisementDataList.length;
    //   return advertisementDataList[adjustedIndex].imageUrl;
    // }
    index = (index + 1) % advertisementDataList.length;
    if (advertisementDataList?.length > 0) {
      const adjustedIndex = (advertisementDataList.length - 1 - index) % advertisementDataList.length;
      return [advertisementDataList[adjustedIndex]];
    }
    return [];
  }
}
