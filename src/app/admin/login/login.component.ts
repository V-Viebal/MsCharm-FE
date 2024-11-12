import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	OnDestroy,
	Input,
	inject
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
	selector: 'login',
	templateUrl: './login.pug',
	styleUrls: ['./login.component.scss'],
	providers: [ TranslateService ],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {

	@Input() logins: string[];
	@Input() selectedItem: MenuItem;

	isLoaded: boolean = false;
	loginsSubsription?: Subscription;
	login: string;

	protected readonly appService: AppService = inject( AppService );
	protected readonly auth: AngularFireAuth = inject( AngularFireAuth );
	protected readonly router: Router = inject( Router );

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
		this.loginsSubsription && this.loginsSubsription.unsubscribe();
	}

	signInWithGoogle() {
		this.auth.signInWithPopup(new GoogleAuthProvider())
		.then(() => {
			this.router.navigate(['/quan-tri']);
		})
	}
}
