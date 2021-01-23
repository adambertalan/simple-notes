import {
  AuthActions,
  loginSuccess,
  loginFailed,
  signupSuccess,
  signupFailed,
  notLoggedIn,
  startLogin,
  checkAuthState,
  startSignup,
  startLogout,
  logoutFinish,
} from './../actions/auth.actions';
import { ActionReducer, createReducer, on } from '@ngrx/store';
import { AuthState } from './app.state';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loginErrorMessage: '',
  loading: false,
  signupErrorMessage: '',
};

/* tslint:disable */
const _authReducer: ActionReducer<AuthState, AuthActions> = createReducer(
  initialState,
  on(startLogin, (state: AuthState) => {
    const newState: AuthState = {
      ...state,
      user: null,
      isAuthenticated: false,
      loginErrorMessage: '',
      signupErrorMessage: '',
      loading: true,
    };
    return newState;
  }),
  on(loginSuccess, (state: AuthState, { user }) => {
    const newState: AuthState = {
      ...state,
      user,
      isAuthenticated: true,
      loginErrorMessage: '',
      signupErrorMessage: '',
      loading: false,
    };
    return newState;
  }),
  on(loginFailed, (state: AuthState, { errorMessage }) => {
    const newState: AuthState = {
      ...state,
      user: null,
      isAuthenticated: false,
      loginErrorMessage: errorMessage,
      signupErrorMessage: '',
      loading: false,
    };
    return newState;
  }),
  on(startSignup, (state: AuthState) => {
    const newState: AuthState = {
      ...state,
      user: null,
      isAuthenticated: false,
      loginErrorMessage: '',
      signupErrorMessage: '',
      loading: true,
    };
    return newState;
  }),
  on(signupSuccess, (state: AuthState, { user }) => {
    const newState: AuthState = {
      ...state,
      user,
      isAuthenticated: true,
      loginErrorMessage: '',
      signupErrorMessage: '',
      loading: false,
    };
    return newState;
  }),
  on(signupFailed, (state: AuthState, { errorMessage }) => {
    const newState: AuthState = {
      ...state,
      user: null,
      isAuthenticated: false,
      loginErrorMessage: '',
      signupErrorMessage: errorMessage,
      loading: false,
    };
    return newState;
  }),
  on(checkAuthState, (state: AuthState) => {
    const newState: AuthState = {
      // Rest of the fields unchanged
      ...state,
      loading: true,
    };
    return newState;
  }),
  on(notLoggedIn, (state: AuthState) => {
    const newState: AuthState = {
      ...state,
      user: null,
      isAuthenticated: false,
      loading: false,
    };
    return newState;
  }),
  on(startLogout, (state: AuthState) => {
    const newState: AuthState = {
      ...state,
      loading: false, // To not show "Logging in" spinner
    };
    return newState;
  }),
  on(logoutFinish, (state: AuthState) => {
    return {
      ...initialState,
    };
  })
);

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  return _authReducer(state, action);
}
