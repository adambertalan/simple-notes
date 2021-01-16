import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Note } from 'src/app/models/note.model';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent implements OnInit {
  @Input() opened: boolean | null = null;
  @Input() subNotes: Note[] = [];
  @Input() selectedNoteId = '';
  @Input() selectedSubNoteId = '';
  @Input() displayNote: Note | null = null;

  @Output() subNoteSelected = new EventEmitter<string>();
  @Output() droppedIntoSubList = new EventEmitter<CdkDragDrop<Note[]>>();

  constructor() {}

  ngOnInit(): void {}

  subNoteSelect(noteId: string): void {
    this.subNoteSelected.emit(noteId);
  }

  dropOntoSub(event: CdkDragDrop<Note[]>): void {
    this.droppedIntoSubList.emit(event);
  }
}
