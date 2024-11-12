import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

	constructor(private auth: AngularFireAuth, private router: Router) {}

	canActivate(): Observable<boolean> {
		return this.auth.authState.pipe(
		  map(user => {
			if ( user && user.uid === 'TBiKI7oFDlXKrnjmykHIalXMCNu1') {
				return true;
			} else {
				// User is not authenticated, navigate to the login page
				this.router.navigate(['/dang-nhap']);
				return false;
			}
		  })
		);
	  }
}
