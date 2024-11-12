import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timestampOrDateToDate' })
export class TimestampOrDateToDatePipe implements PipeTransform {
	constructor(private datePipe: DatePipe) {}
	transform(value: { seconds: number, nanoseconds: number } | Date): string {
			if (value instanceof Date) {
				return value.toLocaleString(); // You can use other date formatting methods as per your requirement
			} else if (value && value.seconds) {
				const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
				return this.datePipe.transform(date.setHours(date.getHours() + 7), 'medium') as string; // You can use other date formatting methods as per your requirement
			} else {
				return '';
			}
	  }
}
