import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthService } from './../../../shared/services/auth.service';
import { PostService } from "../../posts/post.service";
import { UserI } from '../../../shared/models/user.interface';
import { FileI } from './../../../shared/models/file.interface';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public image: FileI;
  public currentImage: string = 'https://i.picsum.photos/id/237/150/150.jpg';
  private discord: string;

  constructor(private authSvc: AuthService, private postSrv: PostService) { }


  public profileForm = new FormGroup({
  displayName: new FormControl('', Validators.required),
  email: new FormControl({value:'', disabled: true}, Validators.required),
  discord: new FormControl('', Validators.required),
  photoURL: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.authSvc.userData$.subscribe(user =>{
      this.initValuesForm(user);
    })
  }

  onSaveUser(user: UserI): void{
    this.authSvc.preSaveUser(user, this.image, this.discord)
    Swal.fire({
      icon: 'success',
      title: 'Correctly safe',
      text: 'Reload page to see changes!',
     })
  }

  private initValuesForm(user: UserI):void{
    if(user.photoURL){
      this.currentImage= user.photoURL
    }
    this.profileForm.patchValue({
      displayName: user.displayName,
      email: user.email,
      discord: this.generateDiscordUsername(user.email)
    })
  }

  private generateDiscordUsername(email: string): string{
    return email.split("@")[0] + "#" + this.getRandomInt();
  }

  private getRandomInt(): number{
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

  handelImage(image: FileI):void{
    this.image = image;
  }



}
