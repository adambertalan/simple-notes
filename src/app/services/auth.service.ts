import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticated: Observable<boolean> | undefined;
  user: firebase.User | null = null;

  constructor(public auth: AngularFireAuth, private router: Router) {
    this.authenticated = this.auth.authState.pipe(
      map((firebaseUser) => !!firebaseUser)
    );
    this.auth.authState.subscribe((firebaseUser) => {
      this.user = firebaseUser;
    });
  }

  register(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  logout(): void {
    this.auth.signOut();
  }
}
