import {
	ChangeDetectionStrategy,
	Component,
	OnInit
} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.pug',
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

	ngOnInit(): void {
	}
}
