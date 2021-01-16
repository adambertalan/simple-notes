import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  confirmPassword = '';

  authSub: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Passwords does not match!', '', {
        duration: 4000,
      });
      return;
    }
    this.authService.authenticated?.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/home']);
      }
    });
    this.authService.register(this.email, this.password).catch((err) => {
      this.snackBar.open(`😱 ${err.message} 💥`, '', {
        duration: 4000,
      });
    });
  }
}
