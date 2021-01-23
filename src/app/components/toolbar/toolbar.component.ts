import {
  moveRootNoteToSub,
  startRemoveRootNote,
  startRemoveSubNote,
} from './../../store/actions/notes.actions';
import {
  selectIsMoveToSubEnabled,
  selectDisplayNoteId,
  selectIsLoading,
} from './../../store/selectors/notes.selectors';
import { Observable } from 'rxjs';
import { selectIsAuthenticated } from './../../store/selectors/auth.selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers/app.state';
import { first, map, withLatestFrom } from 'rxjs/operators';
import { startLogout } from 'src/app/store/actions/auth.actions';
import { startAddRootNote } from 'src/app/store/actions/notes.actions';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  authenticated$: Observable<boolean> = this.store$.select(
    selectIsAuthenticated
  );

  isMoveToSubEnabled$: Observable<boolean> = this.store$.select(
    selectIsMoveToSubEnabled
  );

  isNoteSelected$: Observable<boolean> = this.store$
    .select(selectDisplayNoteId)
    .pipe(map((displayNoteId) => !!displayNoteId));

  isLoading$: Observable<boolean> = this.store$.select(selectIsLoading);

  isAuthLoading$: Observable<boolean> = this.store$.select(
    (state: AppState) => state.auth.loading
  );

  newNotePosition$: Observable<number> = this.store$.select((state: AppState) =>
    state.notes.selectedRootNoteId
      ? state.notes.rootNotes.findIndex(
          (n) => n.id === state.notes.selectedRootNoteId
        ) + 1
      : state.notes.rootNotes.length
  );

  selectedRootNoteId$: Observable<string> = this.store$.select(
    (state: AppState) => state.notes.selectedRootNoteId
  );
  selectedSubNoteId$: Observable<string> = this.store$.select(
    (state: AppState) => state.notes.selectedSubNoteId
  );
  displayNoteId$: Observable<string> = this.store$.select(selectDisplayNoteId);
  selectedRootNoteIndex$: Observable<number> = this.store$.select(
    (state: AppState) =>
      state.notes.rootNotes.findIndex(
        (n) => n.id === state.notes.selectedRootNoteId
      )
  );
  subNotesLength$: Observable<number> = this.store$.select(
    (state: AppState) => {
      const selectedRootNoteIndex = state.notes.rootNotes.findIndex(
        (n) => n.id === state.notes.selectedRootNoteId
      );
      if (selectedRootNoteIndex === -1) {
        return 0;
      }
      return (
        state.notes.rootNotes[selectedRootNoteIndex - 1].subNotes?.length ?? 0
      );
    }
  );
  noteIdBeforeSelectedRootNote$: Observable<string> = this.store$.select(
    (state: AppState) => {
      const selectedRootNoteIndex = state.notes.rootNotes.findIndex(
        (n) => n.id === state.notes.selectedRootNoteId
      );
      if (selectedRootNoteIndex === -1) {
        return '';
      }
      return state.notes.rootNotes[selectedRootNoteIndex - 1].id;
    }
  );

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {}

  moveToSubClick(): void {
    this.selectedRootNoteIndex$
      .pipe(
        first(),
        withLatestFrom(this.subNotesLength$, this.noteIdBeforeSelectedRootNote$)
      )
      .subscribe(([index, subNotesLength, parentId]) => {
        if (index === -1) {
          return;
        }
        this.store$.dispatch(
          moveRootNoteToSub({
            rootNoteIndex: index,
            subNoteIndex: subNotesLength,
            subNoteParentId: parentId,
          })
        );
      });
  }

  deleteClick(): void {
    this.displayNoteId$
      .pipe(
        first(),
        withLatestFrom(this.selectedRootNoteId$, this.selectedSubNoteId$)
      )
      .subscribe(([displayNoteId, selectedRootNoteId, selectedSubNoteId]) => {
        if (displayNoteId === selectedRootNoteId) {
          this.store$.dispatch(startRemoveRootNote({ noteId: displayNoteId }));
        } else if (displayNoteId === selectedSubNoteId) {
          this.store$.dispatch(
            startRemoveSubNote({
              parentNoteId: selectedRootNoteId,
              noteId: displayNoteId,
            })
          );
        }
      });
  }

  createClick(): void {
    this.newNotePosition$.pipe(first()).subscribe((position) => {
      this.store$.dispatch(
        startAddRootNote({
          title: 'My new note',
          content: 'Great ideas goes here',
          position,
        })
      );
    });
  }

  logout(): void {
    this.store$.dispatch(startLogout());
  }
}
