import { Action, createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user.model';

export enum AuthActionTypes {
  START_LOGIN = 'START_LOGIN',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  START_SIGNUP = 'START_SIGNUP',
  SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
  SIGNUP_FAILED = 'SIGNUP_FAILED',
  START_LOGOUT = 'START_LOGOUT',
  LOGOUT_FINISH = 'LOGOUT_FINISH',
  CHECK_AUTH_STATE = 'CHECK_AUTH_STATE',
  NOT_LOGGED_IN = 'NOT_LOGGED_IN',
}

export class StartLogin implements Action {
  readonly type: string = AuthActionTypes.START_LOGIN;
}

export class LoginSuccess implements Action {
  readonly type: string = AuthActionTypes.LOGIN_SUCCESS;
}

export class LoginFailed implements Action {
  readonly type: string = AuthActionTypes.LOGIN_FAILED;
}

export class StartSignup implements Action {
  readonly type: string = AuthActionTypes.START_SIGNUP;
}

export class SignupFailed implements Action {
  readonly type: string = AuthActionTypes.SIGNUP_FAILED;
}

export class SignupSuccess implements Action {
  readonly type: string = AuthActionTypes.SIGNUP_SUCCESS;
}

export class StartLogout implements Action {
  readonly type: string = AuthActionTypes.START_LOGOUT;
}

export class LogoutFinish implements Action {
  readonly type: string = AuthActionTypes.LOGOUT_FINISH;
}

export class CheckAuthState implements Action {
  readonly type: string = AuthActionTypes.CHECK_AUTH_STATE;
}

export class NotLoggedIn implements Action {
  readonly type: string = AuthActionTypes.NOT_LOGGED_IN;
}

export const startLogin = createAction(
  AuthActionTypes.START_LOGIN,
  props<{ email: string; password: string }>()
);
export const loginSuccess = createAction(
  AuthActionTypes.LOGIN_SUCCESS,
  props<{ user: User }>()
);
export const loginFailed = createAction(
  AuthActionTypes.LOGIN_FAILED,
  props<{ errorMessage: string }>()
);
export const startSignup = createAction(
  AuthActionTypes.START_SIGNUP,
  props<{ email: string; password: string }>()
);
export const signupSuccess = createAction(
  AuthActionTypes.SIGNUP_SUCCESS,
  props<{ user: any }>()
);
export const signupFailed = createAction(
  AuthActionTypes.SIGNUP_FAILED,
  props<{ errorMessage: string }>()
);
export const startLogout = createAction(AuthActionTypes.START_LOGOUT);
export const logoutFinish = createAction(AuthActionTypes.LOGOUT_FINISH);
export const checkAuthState = createAction(AuthActionTypes.CHECK_AUTH_STATE);
export const notLoggedIn = createAction(AuthActionTypes.NOT_LOGGED_IN);

export type AuthActions =
  | LoginSuccess
  | LoginSuccess
  | LoginFailed
  | StartSignup
  | SignupSuccess
  | SignupFailed
  | StartLogout
  | LogoutFinish
  | CheckAuthState
  | NotLoggedIn;
