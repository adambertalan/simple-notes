import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Note } from 'src/app/models/note.model';
import {
  moveRootNoteToSub,
  reorderSubNotes,
} from 'src/app/store/actions/notes.actions';
import { AppState } from 'src/app/store/reducers/app.state';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent implements OnInit {
  subNotes$: Observable<Note[]> = this.store$.select(
    (state: AppState) => state.notes.subNotes
  );
  opened$: Observable<boolean> = this.store$.select(
    (state: AppState) => state.notes.subNotesOpen
  );
  selectedRootNoteId$: Observable<string> = this.store$.select(
    (state: AppState) => state.notes.selectedRootNoteId
  );
  selectedSubNoteId$: Observable<string> = this.store$.select(
    (state: AppState) => state.notes.selectedSubNoteId
  );
  hasDisplayNote$: Observable<boolean> = this.store$
    .select((state: AppState) => state.notes.displayNoteId)
    .pipe(map((displayNoteId) => !!displayNoteId));

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {}

  dropOntoSub(event: CdkDragDrop<Note[]>): void {
    this.selectedRootNoteId$.pipe(first()).subscribe((selectedRootNoteId) => {
      if (event.previousContainer === event.container) {
        // Simple reorder on sub list
        this.store$.dispatch(
          reorderSubNotes({
            parentNoteId: selectedRootNoteId,
            fromIndex: event.previousIndex,
            toIndex: event.currentIndex,
          })
        );
      } else {
        // Transfer from root to sub
        this.store$.dispatch(
          moveRootNoteToSub({
            rootNoteIndex: event.previousIndex,
            subNoteIndex: event.currentIndex,
            subNoteParentId: selectedRootNoteId,
          })
        );
      }
    });
  }
}
