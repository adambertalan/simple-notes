import { NoteService } from './../../services/note.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-list-placeholder',
  templateUrl: './note-list-placeholder.component.html',
  styleUrls: ['./note-list-placeholder.component.scss'],
})
export class NoteListPlaceholderComponent implements OnInit {
  constructor(private noteService: NoteService) {}

  ngOnInit(): void {}

  createNote(): void {
    this.noteService.createNote.next();
  }
}
