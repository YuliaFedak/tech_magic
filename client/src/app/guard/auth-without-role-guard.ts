import {CanActivateFn, Router} from '@angular/router';
import {inject, PLATFORM_ID} from '@angular/core';
import {AuthApi} from '../services/auth-api';
import {isPlatformBrowser} from '@angular/common';

export const authWithoutRoleGuard: CanActivateFn = (route, state) => {
  const authApi = inject(AuthApi);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return false;

  const token = authApi.getToken();
  if (token) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
