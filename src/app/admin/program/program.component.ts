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
import { Observable, Subscription, forkJoin, take } from 'rxjs';
import { MessageService, MenuItem, ConfirmationService } from 'primeng/api';
import _ from 'lodash';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AppService, IProgram } from '../../app.service';
import { ImageService } from '../../common/services/image.service';

@Component({
	selector: 'program',
	templateUrl: './program.pug',
	styleUrls: ['./program.component.scss'],
	providers: [ TranslateService ],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class ProgramComponent implements OnInit, OnDestroy {

	@Input() selectedItem: MenuItem;

	programs: IProgram[];

	isLoaded: boolean;
	submitted: boolean;
	programDialog: boolean;
	programsSubsription?: Subscription;
	program: IProgram;

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
		this.programsSubsription = this.appService.getPrograms()
		.pipe( take(1) )
		.subscribe({
			next: ( programs: any ) => {
				this.programs = programs;

				this._cdRef.markForCheck();
			}
		});
	}

	ngOnDestroy(): void {
		this.programsSubsription && this.programsSubsription.unsubscribe();
		this.programs = [];
	}

	setImages( files: File[] ) {
		const uploadObservables: Observable<any>[] = files.map( file => this.imageService.uploadImage( file ));

		forkJoin(uploadObservables)
		.subscribe(
			results => {
				this.program.images = results;
			},
			error => {
				console.error('Error uploading files', error);
			}
		);
	}

	setMainImage( imageFile: File | string ) {
		if ( typeof( imageFile ) === 'string' ) {
			this.program.mainPic =  imageFile;

			this._cdRef.markForCheck();
		} else {
			this.imageService.uploadImage( imageFile ).subscribe( ( url: string ) => {
				this.program.mainPic =  url;

				this._cdRef.markForCheck();
			} );
		}
	}

	openNew() {
		this.program = {};
		this.submitted = false;
		this.programDialog = true;
	}

	editProgram( program: IProgram ) {
		this.program = { ...program };
		this.programDialog = true;
	}

	deleteProgram( program: IProgram ) {
		this.appService.deleteProgram( program.id || '' )
		.then( () => {
			this.programs = this.programs.filter((val) => val.id !== program.id);
			this.program = {};
			this._messageService.add({ severity: 'success', summary: 'Đã Xoá', life: 3000 });
		} );
	}

	hideDialog() {
		this.programDialog = false;
		this.submitted = false;
	}

	saveProgram() {
		this.submitted = true;

		if ( this.program.topic?.trim() ) {
			if (this.program.id) {
				this.appService.updateProgram( this.program )
				.then( ( results: boolean  ) => {
					if ( results ) {
						this.programs[ _.findIndex( this.programs, ( program: IProgram ) => program.id === this.program.id ) ] = this.program;
						this._messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã Cập Nhật Chương Trình', life: 3000 });

						this.programs = [...this.programs];
						this.programDialog = false;
						this.program = {};
						this.submitted = false;
					}
				} )
			} else {
				this.program.order = ( this.programs[ 0 ].order as number ) - 1;

				this.appService.createProgram( this.program )
				.then( ( program: IProgram  ) => {
					_.assign( this.program, program );
					this.programs.unshift( this.program );
					this._messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã Tạo Chương Trình', life: 3000 });

					this.programs = [...this.programs];
					this.programDialog = false;
					this.program = {};
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

	onRowReorder( e: any ) {
		const curentOrder: number  = this.programs[ e.dragIndex ].order as number;

		this.programs[ e.dragIndex ].order = this.programs[ e.dropIndex ].order;
		this.appService.updateProgram( this.programs[ e.dragIndex ] )
		.then( ( results: boolean  ) => {
			if ( results ) {
			}
		} )

		this.programs[ e.dropIndex ].order = curentOrder;
		this.appService.updateProgram( this.programs[ e.dropIndex ] )
		.then( ( results: boolean  ) => {
			if ( results ) {
			}
		} )
	}

}
