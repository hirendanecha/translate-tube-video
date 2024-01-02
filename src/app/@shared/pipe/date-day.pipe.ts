import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDay'
})
export class DateDayPipe implements PipeTransform {

  transform(value: string): string {
    const currentDate = new Date();
    const diffInTime = currentDate.getTime() - new Date(value).getTime();
    const diffInSeconds = Math.round(diffInTime / 1000);
    const diffInMinutes = Math.round(diffInTime / (1000 * 60));
    const diffInHours = Math.round(diffInTime / (1000 * 3600));
    const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
    
    if (diffInSeconds <= 60) {
      return 'just now';
    }

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }

    if (diffInDays === 0 && diffInMinutes >= 60) {
      return `${diffInHours}h ago`;
    }
    
    if (diffInDays === 1) {
      return '1 day ago';
    }

    return `${diffInDays} days ago`;
  }
}