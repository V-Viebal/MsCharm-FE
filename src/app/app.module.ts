import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FIREBASE_OPTIONS, AngularFireModule  } from '@angular/fire/compat';
import { NgOptimizedImage } from '@angular/common'

import { ENVIRONMENT } from '../../src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';

import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';

import { NewsComponent } from './admin/news/news.component';
import { ProgramComponent } from './admin/program/program.component';
import { ImageComponent } from './admin/image/image.component';
import { HomeComponent } from './home/home.component';
import { PictureUploadComponent } from './common/components/picture-upload/picture-upload.component';
import { LoginComponent } from './admin/login/login.component';
import { TimestampOrDateToDatePipe } from './common/pipes/timestamp.pipe';


@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		AdminComponent,
		LoginComponent,
		NewsComponent,
		ProgramComponent,
		ImageComponent,
		PictureUploadComponent,
		TimestampOrDateToDatePipe,
	],
	imports: [
		CommonModule,
		FormsModule,
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		NgOptimizedImage,
		AppRoutingModule,

		DockModule,
		TooltipModule,
		TableModule,
		DialogModule,
		ToastModule,
		ToolbarModule,
		ButtonModule,
		InputTextModule,
		InputTextareaModule,
		ConfirmPopupModule,
		CalendarModule,
		FileUploadModule,
		GalleriaModule,

		AngularFireModule.initializeApp( ENVIRONMENT.FIREBASE_CONFIG ),
		AngularFireAuthModule,
		AngularFireStorageModule,
	],
	providers: [
		provideFirebaseApp(() => initializeApp( ENVIRONMENT.FIREBASE_CONFIG )),
		provideFirestore(() => getFirestore()),
		{ provide: FIREBASE_OPTIONS,
		useValue: ENVIRONMENT.FIREBASE_CONFIG },
		MessageService,
		ConfirmationService,
		DatePipe,
		provideClientHydration()
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
