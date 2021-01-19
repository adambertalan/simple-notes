import {
  startLoadNotes,
  loadNotesSuccess,
  loadNotesFail,
} from './../actions/notes.actions';
import { PersistenceService } from './../../services/persistence.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Note } from 'src/app/models/note.model';

@Injectable()
export class NotesEffects {
  constructor(
    private actions$: Actions,
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
                loadNotesFail({ errorMessage: err?.message ?? err.toString() })
              )
            )
          )
        )
      )
    )
  );
}
