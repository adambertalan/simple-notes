import { PersistenceService } from './../../services/persistence.service';
import { AuthService } from './../../services/auth.service';
import { NoteService } from './../../services/note.service';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  authenticated = false;

  constructor(
    public noteService: NoteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authenticated?.subscribe((isAuthenticated) => {
      this.authenticated = isAuthenticated;
      if (!this.authenticated) {
        this.router.navigate(['login']);
      }
    });
  }

  moveToSubClick(): void {
    if (this.noteService.selectedNoteId) {
      this.noteService.moveToSubNote.next(this.noteService.selectedNoteId);
    }
  }

  deleteClick(): void {
    if (this.noteService.selectedNoteId) {
      this.noteService.deleteNote.next(this.noteService.selectedNoteId);
    }
  }

  createClick(): void {
    this.noteService.createNote.next();
  }

  logout(): void {
    this.authService.logout();
  }
}
