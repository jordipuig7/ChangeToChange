import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service'
import { Observable } from 'rxjs';
import { PostI } from 'src/app/shared/models/post.interface';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  public post$ : Observable<PostI>;
  public userIdPost: String;
  public userDiscordHash: Number;
   

  constructor(private route: ActivatedRoute, private postSvc: PostService) { }
  

  ngOnInit() {
  const idPost = this.route.snapshot.params.id;
  this.post$ =  this.postSvc.getOnePost(idPost);
  this.userDiscordHash = this.getRandomInt();
    }
  
    public generateDiscordUsername(email: string): string{
      return email.split("@")[0] + "#" + this.userDiscordHash;
    }
  
    private getRandomInt(): number{
      return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    }

}
