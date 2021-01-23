import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers/app.state';
import { startLogin } from 'src/app/store/actions/auth.actions';
import { selectLoginErrorMessage } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  loginErrorMsg$: Observable<string> = this.store$.select(
    selectLoginErrorMessage
  );

  constructor(private store$: Store<AppState>, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loginErrorMsg$.subscribe((msg) => {
      if (msg) {
        this.snackBar.open(`😱 ${msg} 💥`, '', {
          duration: 4000,
        });
      }
    });
  }

  onSubmit(): void {
    this.store$.dispatch(
      startLogin({
        email: this.email,
        password: this.password,
      })
    );
  }
}
