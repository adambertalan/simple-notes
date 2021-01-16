import { Note } from './../models/note.model';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  loadNotes(): Promise<Note[]> {
    return new Promise((resolve, reject) => {
      this.db
        .list(this.authService.user?.uid + '/notes')
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
    const ref = this.db.object(this.authService.user?.uid + '/notes');

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
      ref.set(transformedNotes).then(() => {
        resolve();
      });
    });
  }

  addRootNote(
    title: string,
    content: string,
    position: number
  ): Promise<string> {
    const ref = this.db.list(this.authService.user?.uid + '/notes');

    return new Promise((resolve, reject) => {
      ref
        .push({
          title,
          content,
          position,
        })
        .then((savedRef) => {
          resolve(savedRef.key ?? '');
        });
    });
  }

  updateRootNote(note: Note): Promise<void> {
    const ref = this.db.object(
      this.authService.user?.uid + '/notes/' + note.id
    );

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
        });
    });
  }

  removeRootNote(noteId: string): Promise<void> {
    const ref = this.db.object(this.authService.user?.uid + '/notes/' + noteId);

    return new Promise((resolve, reject) => {
      ref.remove().then(() => {
        resolve();
      });
    });
  }

  addSubNote(
    parentNoteId: string,
    title: string,
    content: string,
    position: number
  ): Promise<void> {
    const ref = this.db.list(
      this.authService.user?.uid + '/notes/' + parentNoteId + '/subNotes'
    );

    return new Promise((resolve, reject) => {
      ref
        .push({
          title,
          content,
          position,
        })
        .then(() => {
          resolve();
        });
    });
  }

  updateSubNote(parentNoteId: string, note: Note): Promise<void> {
    const ref = this.db.object(
      this.authService.user?.uid +
        '/notes/' +
        parentNoteId +
        '/subNotes/' +
        note.id
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
        });
    });
  }

  removeSubNote(parentNoteId: string, subNoteId: string): Promise<void> {
    const ref = this.db.object(
      this.authService.user?.uid +
        '/notes/' +
        parentNoteId +
        '/subNotes/' +
        subNoteId
    );
    return new Promise((resolve, reject) => {
      ref.remove().then(() => {
        resolve();
      });
    });
  }
}
