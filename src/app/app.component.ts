import { selectIsAuthenticated } from './store/selectors/auth.selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { checkAuthState } from './store/actions/auth.actions';
import { AppState } from './store/reducers/app.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store$: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.store$.dispatch(checkAuthState());
    this.store$.select(selectIsAuthenticated).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['home']);
      } else {
        this.router.navigate(['login']);
      }
    });
  }
}
