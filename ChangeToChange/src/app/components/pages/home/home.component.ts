import { Component, OnInit } from '@angular/core';
import { PostService } from '../../posts/post.service'
import { PostI } from '../../../shared/models/post.interface'
import{ AuthService} from '../../../shared/services/auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public posts$ : Observable<PostI[]>;
  constructor(private postSvc: PostService, public authSvc: AuthService) { }
  filterPost = '';
  public opened = false;



  ngOnInit() {
    
    //this.postSvc.getAllPost().subscribe(res => console.log('POSTS', res))
    this.posts$ = this.postSvc.getAllPosts();
    
  }

  public substrTitle(title: string){
    if(title.length < 27)
      return title;
    else
      return title.substr(0, 40).concat("...");
  }

  public substrChange(change: string){
    if(change.length < 100)
    return change;
  else
    return change.substr(0, 300).concat("...");
  }

  onClickSeach(){
     return this.opened = !this.opened;
     
  }


}
