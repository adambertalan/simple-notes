import { Note } from './../../models/note.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers/app.state';
import {
  selectRootNote,
  selectSubNote,
} from 'src/app/store/actions/notes.actions';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent implements OnInit {
  @Input() notes: Note[] = [];
  @Input() listId = '';
  @Input() otherListId = '';
  @Input() selectedId = '';
  @Input() isRoot = false;

  @Output() noteDrop = new EventEmitter<CdkDragDrop<Note[]>>();

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {}

  noteSelected(note: Note): void {
    if (this.isRoot) {
      this.store$.dispatch(selectRootNote({ note }));
    } else {
      this.store$.dispatch(selectSubNote({ note }));
    }
  }

  drop(event: CdkDragDrop<Note[]>): void {
    this.noteDrop.emit(event);
  }
}
