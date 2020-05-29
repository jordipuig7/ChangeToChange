import { Injectable } from '@angular/core';
import { UserI } from '../models/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FileI } from '../models/file.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import * as firebase from 'firebase/app'
import { CookieService } from 'ngx-cookie-service';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userData$: Observable<firebase.User>;
  private filePath: string;
  public sBarFilter = "";
  

 
  constructor(private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private cookieService: CookieService) {
    this.userData$ = afAuth.authState
  }

  loginGoogle(){
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  deleteLoginCookie(){
    if (this.cookieService.check('Login')) {
      this.cookieService.delete('Login');
    }
  }

  saveLoginCookie(email: string){
    var cookieExpiration = new Date().setHours(new Date().getDate() + 12);
    this.cookieService.set( 'Login', email, cookieExpiration );
  }
  
  getCurrentLoginCookie() : string{
    if (this.cookieService.check('Login')) {
      return this.cookieService.get('Login');
    }
  }

  loginByEmail(user: UserI) {
    const { email, password } = user;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password) 
  }

  logOut() {
    this.afAuth.auth.signOut();
    this.deleteLoginCookie();
  }

  preSaveUser(user: UserI, image?:FileI, discord?:string):void{
    if(image){
      this.uploadImage(user, image)
    } else {
      this.saveUserProfile(user);
    }//    
  }

  private uploadImage(user :UserI, image:FileI):void{
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath)
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
    .pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          user.photoURL = urlImage;
          this.saveUserProfile(user);
        });
      })
      ).subscribe();
  }

  private saveUserProfile(user: UserI) {
    this.afAuth.auth.currentUser.updateProfile({
      displayName: user.displayName,
      photoURL: user.photoURL
    }).then(()=> console.log('User Update'))
    .catch (err => console.log('Error', err));
    
  }






}

