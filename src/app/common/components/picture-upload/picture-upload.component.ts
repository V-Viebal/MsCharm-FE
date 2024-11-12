import {
	Component, OnInit, OnChanges,
	Input, ViewChild, ElementRef,
	Output, EventEmitter, SimpleChanges,
	ChangeDetectionStrategy, ChangeDetectorRef
} from "@angular/core";
import * as _ from "lodash";

@Component({
	selector: "app-picture-upload",
	templateUrl: "./picture-upload.component.pug",
	styleUrls: ["./picture-upload.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureUploadComponent implements OnInit, OnChanges {

	@ViewChild("fileInput") fileInput!: ElementRef;

	@Input() avatar!: boolean;
	@Input() imgSrc!: string | undefined;
	@Input() imgSrcArray!: string[];

	@Output() outputImg = new EventEmitter<File | string>();
	@Output() outputImgArray = new EventEmitter<File[]>();
	@Output() outputOldImgArray = new EventEmitter<string[]>();

	isImageLoading: boolean = false;
	file: any = {};
	avatarDefaultUrl!: string;
	imgSrcPreviewUrl: any = {};

	constructor( private _cdr: ChangeDetectorRef ) {
		this.handleImageChange = this.handleImageChange.bind(this);
	}

	ngOnInit() {
		this.file = null;
		this.avatarDefaultUrl = "assets/images/default-bg.png";

		if ( !_.isString( this.imgSrcPreviewUrl ) ) {
			this.imgSrcPreviewUrl = "assets/images/default-bg.png";
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ( changes['imgSrc']?.currentValue ) {
			this.imgSrcPreviewUrl = changes['imgSrc'].currentValue;
		}
	}

	handleClick() {
		this.isImageLoading = true;
		this.fileInput.nativeElement.click();

		this._cdr.markForCheck();
	}

	handleRemove() {
		this.file = null;
		this.isImageLoading = false;
		this.imgSrcPreviewUrl = this.avatarDefaultUrl = "assets/images/default-bg.png";
		this.fileInput.nativeElement.value = null;
		this.outputImg.emit(this.imgSrcPreviewUrl);
	}

	handleImageChange( event: any ) {
		if (
			event?.currentFiles?.length > 0
				|| ( event.target.files && event.target.files.length > 0 )
		) {
			if( this.avatar ) {
				event.preventDefault();
				let reader = new FileReader();
				let file = event.target.files[ 0 ];
				reader.onloadend = () => {
					this.file = file;
					this.imgSrcPreviewUrl = reader.result;
					this.isImageLoading = false;

					this._cdr.markForCheck();
				};

				this.outputImg.emit( file );
				reader.readAsDataURL( file );
			} else {
				this.outputImgArray.emit( event.currentFiles );
				this.isImageLoading = false;

				this._cdr.markForCheck();
			}
		}

	}

	remove( fileUrl: any ) {
		this.imgSrcArray = this.imgSrcArray.filter( ( image ) => {
			return fileUrl !== image;
		} );

		this.outputOldImgArray.emit( this.imgSrcArray );
	}
}
