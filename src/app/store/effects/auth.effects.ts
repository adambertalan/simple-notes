import { AngularFireAuth } from '@angular/fire/auth';
import {
  loginFailed,
  startSignup,
  signupSuccess,
  signupFailed,
  checkAuthState,
  notLoggedIn,
  startLogout,
  logoutFinish,
} from './../actions/auth.actions';
import { AuthService } from './../../services/auth.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loginSuccess, startLogin } from '../actions/auth.actions';
import { map, mergeMap, catchError, first } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    public auth: AngularFireAuth
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startLogin),
      mergeMap(({ email, password }) =>
        from(this.authService.login(email, password)).pipe(
          map((result) => {
            if (result) {
              return loginSuccess({
                user: {
                  id: result.uid,
                  email: result.email ?? '',
                },
              });
            }
            return loginFailed({ errorMessage: 'Could not sign in!' });
          }),
          catchError((err) => of(loginFailed({ errorMessage: err })))
        )
      )
    )
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startSignup),
      mergeMap(({ email, password }) =>
        from(this.authService.register(email, password)).pipe(
          map((result) => {
            if (result) {
              return signupSuccess({ user: result });
            }
            return signupFailed({ errorMessage: 'Could not register!' });
          }),
          catchError((err) => of(signupFailed({ errorMessage: err })))
        )
      )
    )
  );

  startLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startLogout),
      mergeMap(() => from(this.auth.signOut()).pipe(map(() => logoutFinish())))
    )
  );

  checkAuthState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkAuthState),
      mergeMap(() =>
        this.auth.authState.pipe(
          first(),
          map((firebaseUser) => {
            if (firebaseUser) {
              return loginSuccess({
                user: {
                  id: firebaseUser.uid,
                  email: firebaseUser.email ?? '',
                },
              });
            }
            return notLoggedIn();
          })
        )
      )
    )
  );
}
