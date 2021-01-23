import { selectIsAuthenticated } from './../store/selectors/auth.selectors';
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
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers/app.state';

@Injectable({
  providedIn: 'root',
})
export class UnauthGuard implements CanActivate {
  constructor(private store$: Store<AppState>, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return (
      this.store$.select(selectIsAuthenticated).pipe(
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
