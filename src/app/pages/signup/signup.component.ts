import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectSignupErrorMessage } from 'src/app/store/selectors/auth.selectors';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers/app.state';
import { startSignup } from 'src/app/store/actions/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';

  signupErrorMsg$: Observable<string> = this.store$.select(
    selectSignupErrorMessage
  );

  constructor(private store$: Store<AppState>, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.signupErrorMsg$.subscribe((msg) => {
      if (msg) {
        this.snackBar.open(`😱 ${msg} 💥`, '', {
          duration: 4000,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Passwords does not match!', '', {
        duration: 4000,
      });
      return;
    }
    this.store$.dispatch(
      startSignup({
        email: this.email,
        password: this.password,
      })
    );
  }
}
