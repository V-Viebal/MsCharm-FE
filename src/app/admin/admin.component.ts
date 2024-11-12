import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	inject
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { AppService } from '../app.service';

@Component({
	selector: 'admin',
	templateUrl: './admin.pug',
	styleUrls: ['./admin.component.scss'],
	providers: [ TranslateService ],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
	isLoaded: boolean = false;

	items: MenuItem[] | undefined;
	selectedItem: MenuItem;

	protected readonly appService: AppService = inject( AppService );

	ngOnInit(): void {
		this.items = [
			{
				id: '1',
				label: 'Chương Trình',
				icon: 'pi pi-megaphone'
			},
			{
				id: '2',
				label: 'Tin Tức',
				icon: 'pi pi-star'
			},
			{
				id: '3',
				label: 'Hình Ảnh',
				icon: 'pi pi-images'
			},
		];
		this.selectedItem = this.items[ 0 ];
	}
}
