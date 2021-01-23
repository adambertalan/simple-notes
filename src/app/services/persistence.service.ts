import { AppState } from './../store/reducers/app.state';
import { Note } from './../models/note.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { first, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  userId: string | undefined;

  constructor(
    private db: AngularFireDatabase,
    private store$: Store<AppState>
  ) {
    this.store$
      .select((state: AppState) => state.auth.user?.id ?? undefined)
      .subscribe((userId) => {
        this.userId = userId;
      });
  }

  loadNotes(): Promise<Note[]> {
    if (!this.userId) {
      return Promise.reject('User is not logged in!');
    }
    return new Promise((resolve, reject) => {
      this.db
        .list(this.userId + '/notes')
        .snapshotChanges()
        .pipe(
          first(),
          map((changes) => {
            return changes.map((ch) => {
              const note: Note = {
                id: ch.key || '',
                title: ch.payload.child('title').val(),
                content: ch.payload.child('content').val(),
                position: ch.payload.child('position').val(),
                subNotes: [],
              };

              ch.payload.child('subNotes').forEach((snap) => {
                const subNote = {
                  id: snap.key || '',
                  title: snap.child('title').val(),
                  content: snap.child('content').val(),
                  position: snap.child('position').val(),
                };
                note.subNotes?.push(subNote);
              });

              note.subNotes?.sort((a, b) => a.position - b.position);

              return note;
            });
          })
        )
        .subscribe((notes: Note[]) => {
          notes.sort((a, b) => a.position - b.position);
          resolve(notes);
        });
    });
  }

  saveAllNotes(notes: Note[]): Promise<void> {
    if (!this.userId) {
      return Promise.reject('User is not logged in!');
    }
    const ref = this.db.object(this.userId + '/notes');

    const transformedNotes: any = {};

    notes.forEach((rn) => {
      const subNotes: any = {};

      rn.subNotes?.forEach((sn) => {
        subNotes[sn.id] = {
          title: sn.title,
          content: sn.content,
          position: sn.position,
        };
      });

      transformedNotes[rn.id] = {
        title: rn.title,
        content: rn.content,
        position: rn.position,
        subNotes,
      };
    });

    return new Promise((resolve, reject) => {
      ref
        .set(transformedNotes)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  addRootNote(
    title: string,
    content: string,
    position: number
  ): Promise<string> {
    if (!this.userId) {
      return Promise.reject('User is not logged in!');
    }
    const ref = this.db.list(this.userId + '/notes');

    return new Promise((resolve, reject) => {
      ref
        .push({
          title,
          content,
          position,
        })
        .then((savedRef) => {
          resolve(savedRef.key ?? '');
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  updateRootNote(note: Note): Promise<void> {
    if (!this.userId) {
      return Promise.reject('User is not logged in!');
    }
    const ref = this.db.object(this.userId + '/notes/' + note.id);

    const subNotes: any = {};

    note.subNotes?.forEach((sn) => {
      subNotes[sn.id] = {
        title: sn.title,
        content: sn.content,
        position: sn.position,
      };
    });

    return new Promise((resolve, reject) => {
      ref
        .set({
          title: note.title,
          content: note.content,
          position: note.position,
          subNotes,
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  removeRootNote(noteId: string): Promise<void> {
    if (!this.userId) {
      return Promise.reject('User is not logged in!');
    }
    const ref = this.db.object(this.userId + '/notes/' + noteId);

    return new Promise((resolve, reject) => {
      ref
        .remove()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  updateSubNote(parentNoteId: string, note: Note): Promise<void> {
    if (!this.userId) {
      return Promise.reject('User is not logged in!');
    }
    const ref = this.db.object(
      this.userId + '/notes/' + parentNoteId + '/subNotes/' + note.id
    );

    return new Promise((resolve, reject) => {
      ref
        .set({
          title: note.title,
          content: note.content,
          position: note.position,
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  removeSubNote(parentNoteId: string, subNoteId: string): Promise<void> {
    if (!this.userId) {
      return Promise.reject('User is not logged in!');
    }
    const ref = this.db.object(
      this.userId + '/notes/' + parentNoteId + '/subNotes/' + subNoteId
    );
    return new Promise((resolve, reject) => {
      ref
        .remove()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
