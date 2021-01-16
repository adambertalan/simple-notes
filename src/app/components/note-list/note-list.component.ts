import { Note } from './../../models/note.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  @Output() selectedNoteId = new EventEmitter<string>();
  @Output() noteDrop = new EventEmitter<CdkDragDrop<Note[]>>();

  constructor() {}

  ngOnInit(): void {}

  noteSelected(noteId: string): void {
    this.selectedNoteId.emit(noteId);
  }

  drop(event: CdkDragDrop<Note[]>): void {
    this.noteDrop.emit(event);
  }
}
