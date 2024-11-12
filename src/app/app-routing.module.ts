import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './admin/login/login.component';
import { AuthGuard } from './common/services/auth-guard.service';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		data: { preload: true }
	},
	{
		path: 'quan-tri',
		component: AdminComponent,
		data: { preload: true },
		canActivate: [ AuthGuard ]
	},
	{
		path: 'dang-nhap',
		component: LoginComponent,
		data: { preload: true }
	},
];

@NgModule({
	imports: [ RouterModule.forRoot( routes, {
		initialNavigation: 'enabledBlocking',
		useHash: false
	} ) ],
	exports: [RouterModule]
})
export class AppRoutingModule { }
