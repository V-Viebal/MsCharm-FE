import {
	ChangeDetectionStrategy,
	Component,
	OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.pug',
	providers: [ TranslateService ],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
	constructor(
		private _translateService: TranslateService,
	) {}

	ngOnInit(): void {
		this._translateService.use('vi');
	}
}
