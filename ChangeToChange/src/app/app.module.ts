import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewPostComponent } from './components/posts/new-post/new-post.component';
import { NewPostModule } from './components/posts/new-post/new-post.module';
import { PostComponent } from './components/posts/post/post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';

import { CookieService } from "ngx-cookie-service";


/**FireBase */
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire'
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ContainerAppComponent } from './components/pages/container-app/container-app.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
import { EditPostModule } from './components/posts/edit-post/edit-post.module';




@NgModule({
  declarations: [
    AppComponent,
    NewPostComponent,
    PostComponent,
    ToolbarComponent,
    ContainerAppComponent,
    ModalComponent,
    EditPostComponent
    
    
    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    NewPostModule,
    MaterialModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    EditPostModule,
    NgMatSearchBarModule
    
  ],

  entryComponents:[ModalComponent],

  providers: [
    {
      provide: StorageBucket, useValue: 'gs://changetochange-4c269.appspot.com'
    },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
