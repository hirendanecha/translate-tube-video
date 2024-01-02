import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDuration',
})
export class TimeDurationPipe implements PipeTransform {
  transform(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }
}

@Pipe({
  name: 'timeDurationWithSec',
})
export class timeDurationWithSec implements PipeTransform {
  transform(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00:00';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
