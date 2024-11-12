import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	OnDestroy,
	Input,
	inject,
	ViewChild,
	ElementRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, forkJoin, take } from 'rxjs';
import { MessageService, MenuItem, ConfirmationService } from 'primeng/api';
import _ from 'lodash';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AppService, IImage } from '../../app.service';
import { ImageService } from '../../common/services/image.service';

@Component({
	selector: 'image',
	templateUrl: './image.pug',
	styleUrls: ['./image.component.scss'],
	providers: [ TranslateService ],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent implements OnInit, OnDestroy {

	@ViewChild("fileInput") fileInput!: ElementRef;

	@Input() selectedItem: MenuItem;

	images: IImage[];

	isLoaded: boolean;
	submitted: boolean;
	imagesSubsription?: Subscription;

	protected readonly appService: AppService = inject( AppService );
	protected readonly imageService: ImageService = inject( ImageService );
	protected readonly auth: AngularFireAuth = inject( AngularFireAuth );
	protected readonly router: Router = inject( Router );
	protected readonly confirmService: ConfirmationService = inject( ConfirmationService );

	constructor(
		private _cdRef: ChangeDetectorRef,
		private _messageService: MessageService,
	) {
		this.handleImages = this.handleImages.bind(this);
	}

	ngOnInit(): void {
		this.imagesSubsription = this.appService.getImages()
		.pipe( take(1) )
		.subscribe({
			next: ( images: any ) => {
				this.images = images;

				this._cdRef.markForCheck();
			}
		});
	}

	ngOnDestroy(): void {
		this.imagesSubsription && this.imagesSubsription.unsubscribe();
		this.images = [];
	}

	selectImages() {
		this.fileInput.nativeElement.click();
	}

	handleImages( event: any ) {
		if (
			event?.currentFiles?.length > 0
				|| ( event.target.files && event.target.files.length > 0 )
		) {
			const files: File[] = event.target.files;
			const uploadObservables: Observable<any>[]
				= _.map(
					files,
					( file: File ) => this.imageService.uploadImage( file )
				);

			forkJoin(uploadObservables)
			.subscribe(
				results => {
					_.forEach( results, ( src: string, index: number ) => {
						this.images ||= [];
						this.images.push({ id: '', src });

						this.appService.createImage( src )
						.then( ( image: IImage ) => {
							this.images[ index ].id = image.id;

							index === results.length - 1
								&& this._messageService.add({ severity: 'success', summary: 'Đã Thêm', life: 3000 });

							this._cdRef.detectChanges();
						} );
					} );
				},
				error => {
					console.error('Error uploading files', error);
				}
			);
		}
	}

	deleteImage( image: IImage ) {
		this.appService.deleteImage( image.id || '' )
		.then( () => {
			this.images = this.images.filter((val) => val.id !== image.id);
			this._messageService.add({ severity: 'success', summary: 'Đã Xoá', life: 3000 });
		} );
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
