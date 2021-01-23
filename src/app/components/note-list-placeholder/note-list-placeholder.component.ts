import { AppState } from './../../store/reducers/app.state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { startAddRootNote } from 'src/app/store/actions/notes.actions';

@Component({
  selector: 'app-note-list-placeholder',
  templateUrl: './note-list-placeholder.component.html',
  styleUrls: ['./note-list-placeholder.component.scss'],
})
export class NoteListPlaceholderComponent implements OnInit {
  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {}

  createNote(): void {
    this.store$.dispatch(
      startAddRootNote({
        title: 'My new note',
        content: 'Great ideas goes here',
        position: 0,
      })
    );
  }
}
