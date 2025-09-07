import {CanActivateFn, Router} from '@angular/router';
import {inject, PLATFORM_ID} from '@angular/core';
import {AuthApi} from '../services/auth-api';
import {isPlatformBrowser} from '@angular/common';
import {jwtDecode} from 'jwt-decode';
import {IToken} from '../info-system/auth.config';

export const authGuard: (requiredRoles: string[]) => CanActivateFn = (requiredRoles: string[]) => {
  return (route, state) => {
    const authApi = inject(AuthApi);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return false;
    }

    const token = authApi.getToken();
    if (!token) {
      router.navigate(['/auth/login']);
      return false;
    }

    try {
      const decoded: IToken = jwtDecode(token as string);

      if (requiredRoles.includes(decoded.role)) {
        return true;
      } else {
        router.navigate(['/auth/login']);
        return false;
      }

    } catch (e) {
      router.navigate(['/auth/login']);
      return false;
    }
  };
};
