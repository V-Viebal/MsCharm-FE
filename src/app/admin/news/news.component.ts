import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	OnDestroy,
	Input,
	inject
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';
import { MessageService, MenuItem, ConfirmationService } from 'primeng/api';
import _ from 'lodash';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ImageService } from '../../common/services/image.service';
import { AppService, INews } from '../../app.service';

@Component({
	selector: 'news',
	templateUrl: './news.pug',
	styleUrls: ['./news.component.scss'],
	providers: [ TranslateService ],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit, OnDestroy {

	@Input() selectedItem: MenuItem;

	newss: INews[];

	isLoaded: boolean;
	submitted: boolean;
	newsDialog: boolean;
	newssSubsription?: Subscription;
	news: INews;
	date: Date

	protected readonly appService: AppService = inject( AppService );
	protected readonly imageService: ImageService = inject( ImageService );
	protected readonly auth: AngularFireAuth = inject( AngularFireAuth );
	protected readonly router: Router = inject( Router );
	protected readonly confirmService: ConfirmationService = inject( ConfirmationService );

	constructor(
		private _cdRef: ChangeDetectorRef,
		private _messageService: MessageService,
	) {}

	ngOnInit(): void {
		this.newssSubsription = this.appService.getNewss()
		.pipe( take(1) )
		.subscribe({
			next: ( newss: any ) => {
				this.newss = newss;

				this._cdRef.markForCheck();
			}
		});
	}

	ngOnDestroy(): void {
		this.newssSubsription && this.newssSubsription.unsubscribe();
		this.newss = [];
	}

	setMainImage( imageFile: File | string ) {
		if ( typeof( imageFile ) === 'string' ) {
			this.news.mainPic =  imageFile;

			this._cdRef.markForCheck();
		} else {
			this.imageService.uploadImage( imageFile ).subscribe( ( url: string ) => {
				this.news.mainPic =  url;

				this._cdRef.markForCheck();
			} );
		}
	}

	openNew() {
		this.news = {};
		this.date = new Date();
		this.submitted = false;
		this.newsDialog = true;
	}

	editNews( news: INews ) {
		this.news = { ...news };

		this.date = new Date( this.news.date.seconds * 1000 + this.news.date.nanoseconds / 1000000 );

		this.newsDialog = true;
	}

	deleteNews( news: INews ) {
		this.appService.deleteNews( news.id || '' )
		.then( () => {
			this.newss = this.newss.filter((val) => val.id !== news.id);
		this.news = {};
		this._messageService.add({ severity: 'success', summary: 'Đã Xoá', life: 3000 });
		} );
	}

	hideDialog() {
		this.newsDialog = false;
		this.submitted = false;
	}

	saveNews() {
		this.submitted = true;
		this.news.date = this.date;

		if ( this.news.topic?.trim() ) {
			if (this.news.id) {
				this.appService.updateNews( this.news )
				.then( ( results: boolean  ) => {
					if ( results ) {
						this.newss[ _.findIndex( this.newss, ( news: INews ) => news.id === this.news.id ) ] = this.news;
						this._messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã Cập Nhật Tin Tức', life: 3000 });

						this.newss = [...this.newss];
						this.newsDialog = false;
						this.news = {};
						this.submitted = false;
					}
				} )
			} else {
				this.appService.createNews( this.news )
				.then( ( news: INews  ) => {
					_.assign( this.news, news );
					this.newss.push(this.news);
					this._messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã Tạo Tin Tức', life: 3000 });

					this.newss = [...this.newss];
					this.newsDialog = false;
					this.news = {};
					this.submitted = false;
				} )
			}
		}
	}

	signOut() {
		this.confirmService.confirm({
			target: event?.target || undefined,
			message: "Bạn muốn đăng xuất luôn chứ?",
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: "Có",
			rejectLabel: "Không",
			acceptButtonStyleClass: 'accept-cancel',
			rejectButtonStyleClass: 'reject-cancel',
			accept: () => {
				this.auth.signOut().then(() => {
					this.router.navigate(['/']);
				}).catch((error) => {
						console.error('Error during sign out:', error);
				});
			},
			reject: () => {
				this.router.navigate(['/']);
			}
		});
	}
}
