import { createSelector } from '@ngrx/store';
import { AppState, AuthState } from '../reducers/app.state';

// Note: Not all selectors are stored here, some are used on the fly where needed.

export const selectAuth = (state: AppState) => state.auth;

export const selectAuthenticatedUser = createSelector(
  selectAuth,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (state: AuthState) => state.isAuthenticated
);

export const selectLoginErrorMessage = createSelector(
  selectAuth,
  (state: AuthState) => state.loginErrorMessage
);

export const selectSignupErrorMessage = createSelector(
  selectAuth,
  (state: AuthState) => state.signupErrorMessage
);
