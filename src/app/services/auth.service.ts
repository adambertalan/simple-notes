import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public auth: AngularFireAuth) {}

  register(email: string, password: string): Promise<firebase.User | null> {
    return new Promise((resolve, reject) => {
      this.auth
        .createUserWithEmailAndPassword(email, password)
        .then(({ user }) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  login(email: string, password: string): Promise<firebase.User | null> {
    return new Promise((resolve, reject) => {
      this.auth
        .signInWithEmailAndPassword(email, password)
        .then(({ user }) => {
          resolve(user);
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
