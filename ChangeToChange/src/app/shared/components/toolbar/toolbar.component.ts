import { Component, OnInit } from '@angular/core';
import{ AuthService} from '../../services/auth.service';
import { PostI } from '../../models/post.interface';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';




@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  public appName = 'ChangeToChange';
  public otherTheme: boolean = false;
  constructor(public authSvc: AuthService,
    public dialog: MatDialog) { }

  /*changeTheme(){
    this.otherTheme = !this.otherTheme;
  }
*/
  ngOnInit() {
  }

  searchBarOnEnter(event: any){
    this.authSvc.sBarFilter = event;
  }

  closeSearchBar(){
    this.authSvc.sBarFilter = "";
  }

  onLogOut():void{
    this.authSvc.logOut();
  }

  public onNewPost(post: PostI) {
    this.openDialog();
    }

  openDialog(post?: PostI):void{
    const config = {
      data: {
        message: post ? 'Edit Post' : 'New Post',
        content: post
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

}
