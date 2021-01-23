import { AppState } from './../../store/reducers/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Note } from './../../models/note.model';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  moveSubNoteToRoot,
  reorderRootNotes,
  startLoadNotes,
} from 'src/app/store/actions/notes.actions';
import { Observable } from 'rxjs';
import {
  selectRootNotes,
  selectSelectedRootNoteId,
} from 'src/app/store/selectors/notes.selectors';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  rootNotes$: Observable<Note[]> = this.store$.select(selectRootNotes);
  selectedRootNoteId$: Observable<string> = this.store$.select(
    selectSelectedRootNoteId
  );

  constructor(private store$: Store<AppState>, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.store$.dispatch(startLoadNotes());

    this.store$
      .select((state: AppState) => state.notes.errorMessage)
      .subscribe((errorMsg) => {
        if (errorMsg) {
          this.snackBar.open(errorMsg, '', {
            duration: 3000,
          });
        }
      });
  }

  dropOntoRoot(event: CdkDragDrop<Note[]>): void {
    if (event.previousContainer === event.container) {
      // Simple reorder on root
      this.store$.dispatch(
        reorderRootNotes({
          fromIndex: event.previousIndex,
          toIndex: event.currentIndex,
        })
      );
    } else {
      // Transfer from sub to root
      this.selectedRootNoteId$.pipe(first()).subscribe((selectedRootNoteId) => {
        this.store$.dispatch(
          moveSubNoteToRoot({
            subNoteIndex: event.previousIndex,
            subNoteParentId: selectedRootNoteId,
            rootIndex: event.currentIndex,
          })
        );
      });
    }
  }
}
