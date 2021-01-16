import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
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
    this.authSub = this.authService.authenticated?.subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/home']);
        }
      }
    );
    this.authService.login(this.email, this.password).catch((err) => {
      this.snackBar.open(`😱 ${err.message} 💥`, '', {
        duration: 4000,
      });
    });
  }
}
