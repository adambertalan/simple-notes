import { AuthService } from './../services/auth.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnauthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return (
      this.authService.authenticated?.pipe(
        map((isAuthenticated: boolean) => {
          if (isAuthenticated) {
            return this.router.createUrlTree(['home']);
          } else {
            return true;
          }
        })
      ) ?? of(false)
    );
  }
}
