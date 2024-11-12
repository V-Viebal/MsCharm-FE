import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

	constructor(
		private _storage: AngularFireStorage,
	) {}

	uploadImage(imageFile: File): Observable<string> {
		const filePath = `background/${ imageFile.name }`;

		return from( this._storage.upload( filePath, imageFile ) ).pipe(
			switchMap( ( task: any ) => from( task.ref.getDownloadURL() ) as Observable<string> )
		);
	}
}
