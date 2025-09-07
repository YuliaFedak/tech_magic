import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {AuthApi} from '../../services/auth-api';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',

})
export class HomePage {
  private isBrowser: boolean
  // Inject I need for SSR
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public navigateToSignUp() : void {
    this.router.navigate(['/auth/signup'])
  }

  public navigateToLogIn() : void {
    this.router.navigate(['/auth/login'])
  }

  public get isLoggedIn(): boolean {
    return this.isBrowser && !!localStorage.getItem('token')
  }

  public logOut() : void {
    localStorage.removeItem('token')
    this.router.navigate(['/auth/login'])
  }
}
