import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, finalize, filter } from 'rxjs/operators';
import { PostI } from '../../shared/models/post.interface';
import { UserExtendedI } from '../../shared/models/userExtended.interface';
import { FileI } from 'src/app/shared/models/file.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './../../shared/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsCollection: AngularFirestoreCollection<PostI>;
  private adminPostsCollection: AngularFirestoreCollection<PostI>;
  private userExtendedCollection: AngularFirestoreCollection<UserExtendedI>;
  private filePath: any;
  private downloadURL: Observable<string>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private authSvc: AuthService) {
    this.postsCollection = afs.collection<PostI>('posts');
    this.userExtendedCollection = afs.collection<UserExtendedI>('userExtended');
  }

  public calculateAdminPosts(){
    this.adminPostsCollection = this.afs.collection<PostI>('posts', ref => ref.where('idUser', '==', this.authSvc.getCurrentLoginCookie()));   
  }

  public getAllPosts(): Observable<PostI[]> {
    return this.postsCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as PostI;
            const id = a.payload.doc.id;
            return { id, ...data }
          }).sort(this.comparePosts)
        )
      );
  }

  public comparePosts = (a, b) => {
    if (a.postDate < b.postDate) {
      return 1;
    }
    if (a.postDate > b.postDate) {
      return -1;
    }
    return 0;
  }

  public getAdminPosts(): Observable<PostI[]> {
    return this.adminPostsCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as PostI;
            const id = a.payload.doc.id;
            return { id, ...data }
          })
        )
      );
  }

  public getUserExtended(): Observable<UserExtendedI[]> {
    return this.userExtendedCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as UserExtendedI;
            const id = a.payload.doc.id;
            return { id, ...data }
          })
        )
      );
  }

  public getOnePost(id: PostI): Observable<PostI> {
    return this.afs.doc<PostI>(`posts/${id}`).valueChanges();
  }

  public deletePostById(post: PostI) {
    return this.postsCollection.doc(post.id).delete();
  }

  public editPostById(post: PostI, newImage?: FileI) {
    if (newImage) {
      this.uploadImage(post, newImage);
    } else {
      return this.postsCollection.doc(post.id).update(post);
    }
  }


  public preAddAndUpdatePost(post: PostI, image: FileI): void {
    this.uploadImage(post, image);
  }

  private savePost(post: PostI) {

    this.authSvc.userData$.subscribe(user =>{
      const postObj = {
        idUser: user.email ,
        titlePost: post.titlePost,
        contentPost: post.contentPost,
        changeTo: post.changeTo,// prova
        imagePost: this.downloadURL,
        fileRef: this.filePath,
        tagsPost: post.tagsPost,
        postDate: new Date()
      };
      if (post.id) {
        return this.postsCollection.doc(post.id).update(postObj)
      } else {
        return this.postsCollection.add(postObj);
      }
    })

  }


  private uploadImage(post: PostI, image: FileI) {
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            this.downloadURL = urlImage;
            this.savePost(post);
          })
        })
      ).subscribe();
  }

}
