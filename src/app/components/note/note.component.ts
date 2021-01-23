import { Observable, Subject } from 'rxjs';
import { Note } from './../../models/note.model';
import { Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  withLatestFrom,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers/app.state';
import {
  startUpdateRootNote,
  startUpdateSubNote,
} from 'src/app/store/actions/notes.actions';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  titleChangeSubj: Subject<string> = new Subject<string>();
  contentChangeSubj: Subject<string> = new Subject<string>();

  saveTitle = this.titleChangeSubj.pipe(
    filter((text) => text.length > 0),
    distinctUntilChanged(),
    debounceTime(500)
  );

  saveContent = this.contentChangeSubj.pipe(
    filter((text) => text.length > 0),
    distinctUntilChanged(),
    debounceTime(500)
  );

  displayNoteId$: Observable<string> = this.store$.select(
    (state: AppState) => state.notes.displayNoteId
  );
  displayNoteTitle$: Observable<string> = this.store$.select(
    (state: AppState) => state.notes.displayNoteTitle
  );
  displayNoteContent$: Observable<string> = this.store$.select(
    (state: AppState) => state.notes.displayNoteContent
  );

  selectedRootNoteId$: Observable<string> = this.store$.select(
    (state: AppState) => state.notes.selectedRootNoteId
  );
  selectedSubNoteId$: Observable<string> = this.store$.select(
    (state: AppState) => state.notes.selectedSubNoteId
  );
  displayNote$: Observable<Note | undefined> = this.store$.select(
    (state: AppState) =>
      state.notes.rootNotes.find((n) => n.id === state.notes.displayNoteId) ??
      state.notes.subNotes.find((n) => n.id === state.notes.displayNoteId)
  );

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
    this.saveTitle.subscribe((title) => {
      this.displayNote$
        .pipe(
          filter((displayNote) => !!displayNote),
          first(),
          withLatestFrom(this.selectedRootNoteId$, this.selectedSubNoteId$)
        )
        .subscribe(([displayNote, selectedRootNoteId, selectedSubNoteId]) => {
          if (!displayNote) {
            return;
          }
          if (displayNote.id === selectedRootNoteId) {
            this.store$.dispatch(
              startUpdateRootNote({
                note: {
                  ...displayNote,
                  title,
                },
              })
            );
          } else if (displayNote.id === selectedSubNoteId) {
            this.store$.dispatch(
              startUpdateSubNote({
                parentNoteId: selectedRootNoteId,
                note: {
                  ...displayNote,
                  title,
                },
              })
            );
          }
        });
    });

    this.saveContent.subscribe((content) => {
      this.displayNote$
        .pipe(
          filter((displayNote) => !!displayNote),
          first(),
          withLatestFrom(this.selectedRootNoteId$, this.selectedSubNoteId$)
        )
        .subscribe(([displayNote, selectedRootNoteId, selectedSubNoteId]) => {
          if (!displayNote) {
            return;
          }
          if (displayNote.id === selectedRootNoteId) {
            this.store$.dispatch(
              startUpdateRootNote({
                note: {
                  ...displayNote,
                  content,
                },
              })
            );
          } else if (displayNote.id === selectedSubNoteId) {
            this.store$.dispatch(
              startUpdateSubNote({
                parentNoteId: selectedRootNoteId,
                note: {
                  ...displayNote,
                  content,
                },
              })
            );
          }
        });
    });
  }

  titleChange(target: EventTarget | null): void {
    this.titleChangeSubj.next((target as HTMLInputElement).value);
  }

  contentChange(target: EventTarget | null): void {
    this.contentChangeSubj.next((target as HTMLTextAreaElement).value);
  }
}
