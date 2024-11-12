import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import _ from 'lodash';

export interface INews {
	id?: string;
	topic?: string;
	description?: string;
	mainPic?: string;
	date?: any;
}

export interface IProgram {
	id?: string;
	topic?: string;
	description?: string;
	mainPic?: string;
	images?: string[];
	order?: number;
}

export interface IImage {
	id?: string;
	src?: string;
}

@Injectable({
	providedIn: 'root'
})
export class AppService {
	constructor( private _afs: AngularFirestore ) {}

	public getPrograms() {
		return this._afs.collection( 'PROGRAM' ).valueChanges();
	}

	public createProgram( data: IProgram ): Promise<IProgram> {
		const id = this._afs.createId();
		const docRef = this._afs.collection( 'PROGRAM' ).doc( id );
		const program: IProgram = { ...data, id: id };

		return docRef.set( program ).then( () => { return program; } );
	}

	public updateProgram( program: IProgram ): Promise<boolean> {
		let docRef = this._afs.collection( 'PROGRAM' ).doc( program.id );
		return docRef.update( program ).then( () => { return true; } );
	}

	public deleteProgram( programID: string ): Promise<any> {
		const docRef = this._afs.collection( 'PROGRAM' ).doc( programID );
		return docRef.delete();
	}

	public getNewss() {
		return this._afs.collection( 'NEWS' ).valueChanges();
	}

	public createNews( data: INews ): Promise<INews> {
		const id = this._afs.createId();
		const docRef = this._afs.collection( 'NEWS' ).doc( id );
		const news: IProgram = { ...data, id: id };

		return docRef.set( news ).then( () => { return news; } );
	}

	public updateNews( news: INews ): Promise<boolean> {
		let docRef = this._afs.collection( 'NEWS' ).doc( news.id );
		return docRef.update( news ).then( () => { return true; } );
	}

	public deleteNews( newsID: string ): Promise<any> {
		const docRef = this._afs.collection( 'NEWS' ).doc( newsID );
		return docRef.delete();
	}

	public getImages() {
		return this._afs.collection( 'IMAGE' ).valueChanges();
	}

	public createImage( data: string ): Promise<IImage> {
		const id = this._afs.createId();
		const docRef = this._afs.collection( 'IMAGE' ).doc( id );
		const image: IImage = { src: data, id: id };

		return docRef.set( image ).then( () => { return image; } );
	}

	public deleteImage( id: string ): Promise<any> {
		const docRef = this._afs.collection( 'IMAGE' ).doc( id );
		return docRef.delete();
	}
}
