import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnInit,
	OnDestroy,
	Renderer2,
	inject
} from '@angular/core';
import { AppService, IImage, INews, IProgram } from '../app.service';
import { Subscription, take } from 'rxjs';
import _ from 'lodash';

@Component({
	selector: 'home',
	templateUrl: './home.pug',
	styleUrls: ['./home.component.scss'],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
	isLoaded: boolean;
	newsSubsription?: Subscription;
	programsSubsription?: Subscription;
	imagesSubsription?: Subscription;

	newss: INews[];
	programs: IProgram[];
	images: IImage[];
	programImages: string[];

	//galleria
	isShowed: boolean;
	displayCustom: boolean;
	activeIndex: number = 0;
	responsiveOptions: any[];

	protected readonly appService: AppService = inject( AppService );

	constructor(
		private _cdRef: ChangeDetectorRef,
		private _renderer: Renderer2,
		private _el: ElementRef
	) {
		this.responsiveOptions = [
			{
				breakpoint: '1500px',
				numVisible: 5
			},
			{
				breakpoint: '1024px',
				numVisible: 3
			},
			{
				breakpoint: '768px',
				numVisible: 2
			},
			{
				breakpoint: '560px',
				numVisible: 1
			}
		];
	}

	ngOnInit(): void {
		this.isLoaded = true;
		this._cdRef.markForCheck();

		let navbarTogglerNine = this._el.nativeElement.querySelector(".navbar-nine .navbar-toggler");

		navbarTogglerNine.addEventListener( "click", () => {
			if (navbarTogglerNine.classList.contains('active')) {
					this._renderer.removeClass( navbarTogglerNine, 'active' );
				} else {
					this._renderer.addClass( navbarTogglerNine, 'active' );
				}
		} );

		navbarTogglerNine.addEventListener("blur", () => {
			this._renderer.removeClass( navbarTogglerNine, 'active' );
			this._renderer.removeClass( this._el.nativeElement.querySelector('.navbar-collapse'), 'show' );
		});

		this.newsSubsription = this.appService.getNewss()
		.pipe( take(1) )
		.subscribe( ( newss: INews[] ) => {
				this.newss = newss;

				this._cdRef.markForCheck();
		} );

		this.programsSubsription = this.appService.getPrograms()
		.pipe( take(1) )
		.subscribe( ( programs: IProgram[] ) => {
				this.programs = _.orderBy( programs, ['order'], ['asc'] );
console.log(this.programs);

				this._cdRef.markForCheck();
		} );

		this.imagesSubsription = this.appService.getImages()
		.pipe( take(1) )
		.subscribe( ( images: IImage[] ) => {
			this.images = images;

			this._cdRef.markForCheck();
		} );
	}

	ngAfterViewInit() {
	}

	ngOnDestroy(): void {
		this.programsSubsription && this.programsSubsription.unsubscribe();
		this.newsSubsription && this.newsSubsription.unsubscribe();
		this.imagesSubsription && this.imagesSubsription.unsubscribe();
	}

	clickImage(index: number) {
		this.activeIndex = index;

		this.displayCustom = true;

		this._cdRef.markForCheck();
	}

	openGallery() {

	}

	changeImages( srcs: string[] ) {
		this.programImages = srcs;
		this.isShowed = true;

		this._cdRef.markForCheck();
	}
}
