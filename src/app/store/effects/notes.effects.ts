import {
  startLoadNotes,
  loadNotesSuccess,
  startSaveNotes,
  saveNotesSuccess,
  startAddRootNote,
  startUpdateRootNote,
  startRemoveRootNote,
  startUpdateSubNote,
  startRemoveSubNote,
  addRootNoteSuccess,
  updateRootNoteSuccess,
  removeRootNoteSuccess,
  updateSubNoteSuccess,
  removeSubNoteSuccess,
  reorderRootNotes,
  reorderSubNotes,
  dbOperationFail,
  moveRootNoteToSub,
  moveSubNoteToRoot,
} from './../actions/notes.actions';
import { PersistenceService } from './../../services/persistence.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Note } from 'src/app/models/note.model';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/app.state';

@Injectable()
export class NotesEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private persistenceService: PersistenceService
  ) {}

  loadNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startLoadNotes),
      mergeMap(() =>
        from(this.persistenceService.loadNotes()).pipe(
          map(
            (notes: Note[]) => loadNotesSuccess({ notes }),
            catchError((err) =>
              of(
                dbOperationFail({
                  errorMessage: err?.message ?? err.toString(),
                })
              )
            )
          )
        )
      )
    )
  );

  addRootNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startAddRootNote),
      mergeMap(({ title, content, position }) =>
        from(
          this.persistenceService.addRootNote(title, content, position)
        ).pipe(
          map((noteId: string) =>
            addRootNoteSuccess({
              savedNote: {
                id: noteId,
                title,
                content,
                position,
                subNotes: [],
              },
            })
          ),
          catchError((err) =>
            of(dbOperationFail({ errorMessage: err?.message ?? err }))
          )
        )
      )
    )
  );

  saveWholeNoteListAfterPositionUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        addRootNoteSuccess,
        removeRootNoteSuccess,
        removeSubNoteSuccess,
        moveRootNoteToSub,
        moveSubNoteToRoot,
        reorderRootNotes,
        reorderSubNotes
      ),
      withLatestFrom(this.store$),
      map(([_, { notes, auth }]) => startSaveNotes({ notes: notes.rootNotes }))
    )
  );

  saveNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startSaveNotes),
      mergeMap(({ notes }) =>
        from(this.persistenceService.saveAllNotes(notes)).pipe(
          map(() => saveNotesSuccess({ savedNotes: notes })),
          catchError((err) =>
            of(dbOperationFail({ errorMessage: err?.message ?? err }))
          )
        )
      )
    )
  );

  removeRootNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startRemoveRootNote),
      mergeMap(({ noteId }) =>
        from(this.persistenceService.removeRootNote(noteId)).pipe(
          map(() => removeRootNoteSuccess({ removedId: noteId })),
          catchError((err) =>
            of(dbOperationFail({ errorMessage: err?.message ?? err }))
          )
        )
      )
    )
  );

  removeSubNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startRemoveSubNote),
      mergeMap(({ parentNoteId, noteId }) =>
        from(this.persistenceService.removeSubNote(parentNoteId, noteId)).pipe(
          map(() =>
            removeSubNoteSuccess({ parentNoteId, removedNoteId: noteId })
          ),
          catchError((err) =>
            of(dbOperationFail({ errorMessage: err?.message ?? err }))
          )
        )
      )
    )
  );

  updateRootNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startUpdateRootNote),
      mergeMap(({ note }) =>
        from(this.persistenceService.updateRootNote(note)).pipe(
          map(() => updateRootNoteSuccess({ updatedNote: note })),
          catchError((err) =>
            of(dbOperationFail({ errorMessage: err?.message ?? err }))
          )
        )
      )
    )
  );

  updateSubNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startUpdateSubNote),
      mergeMap(({ parentNoteId, note }) =>
        from(this.persistenceService.updateSubNote(parentNoteId, note)).pipe(
          map(() => updateSubNoteSuccess({ parentNoteId, updatedNote: note })),
          catchError((err) =>
            of(dbOperationFail({ errorMessage: err?.message ?? err }))
          )
        )
      )
    )
  );
}
