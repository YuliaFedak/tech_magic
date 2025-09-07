import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import {AuthApi} from '../../services/auth-api';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',

})
export class NavBar implements OnInit{
  actorId$ = new BehaviorSubject<string | null>(null);
  isBrowser: boolean
  constructor(
    public authApi: AuthApi,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.authApi.getActorId().subscribe({
        next: (res) => {

          this.actorId$.next(res.actorId)
          console.log(this.actorId$)
        },
        error: (err) => console.error(err)
      });
    }
  }
}
