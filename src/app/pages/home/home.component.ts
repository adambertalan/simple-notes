import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../services/auth.service';
import { PersistenceService } from './../../services/persistence.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NoteService } from './../../services/note.service';
import { Note } from './../../models/note.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  selectedNoteId = '';
  selectedSubNoteId = '';
  opened = false;

  rootNotes: Note[] = [];

  subNotes: Note[] = [];

  displayNote: Note | null = null;

  constructor(
    private noteService: NoteService,
    private persistenceService: PersistenceService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.noteService.createNote.subscribe(() => {
      this.noteService.loading = true;

      const title = 'My new note';
      const content = '';
      let position = this.rootNotes.length;

      if (this.selectedNoteId) {
        const selectedNoteIndex =
          this.rootNotes.findIndex((rn) => rn.id === this.selectedNoteId) ?? -1;
        if (selectedNoteIndex >= 0) {
          position = selectedNoteIndex + 1;
        }
      }
      this.persistenceService
        .addRootNote(title, content, position)
        .then((id: string) => {
          this.rootNotes.splice(position, 0, {
            id,
            title,
            content,
            position,
            subNotes: [],
          });
          this.storePosition();
          this.noteSelected(id);
        });
    });

    this.noteService.deleteNote.subscribe((noteId: string) => {
      this.noteService.loading = true;

      const rootNoteIndex =
        this.rootNotes.findIndex((rn) => rn.id === noteId) ?? -1;
      if (rootNoteIndex >= 0) {
        // Root note deletion
        this.persistenceService.removeRootNote(noteId).then(() => {
          this.rootNotes.splice(rootNoteIndex, 1);
          this.opened = false;
          this.selectedNoteId = '';
          this.selectedSubNoteId = '';
          this.displayNote = null;
          this.noteService.selectedNoteId = null;
          this.noteService.selectedNoteCanBeSub = false;
          this.storePosition();
        });
      } else {
        // Sub note deletion
        const selectedNote = this.rootNotes.find(
          (rn) => rn.id === this.selectedNoteId
        );
        const deleteNoteIndex =
          selectedNote?.subNotes?.findIndex((sn) => sn.id === noteId) ?? 0;
        if (deleteNoteIndex >= 0) {
          this.persistenceService
            .removeSubNote(this.selectedNoteId, noteId)
            .then(() => {
              selectedNote?.subNotes?.splice(deleteNoteIndex, 1);
              this.storePosition();

              if (selectedNote?.subNotes?.length === 0) {
                // No more sub notes, select parent
                this.opened = false;
                this.noteSelected(this.selectedNoteId);
              } else {
                // Still some sub notes
                this.displayNote = null;
                this.selectedSubNoteId = '';
                this.noteService.selectedNoteCanBeSub = false;
              }
            });
        }
      }
    });

    this.noteService.moveToSubNote.subscribe((noteId: string) => {
      this.noteService.loading = true;

      const noteToMoveIndex = this.rootNotes.findIndex(
        (rn) => rn.id === noteId
      );
      const noteToMove = this.rootNotes.find((rn) => rn.id === noteId);
      if (noteToMove === null || noteToMove === undefined) {
        return;
      }
      this.rootNotes[noteToMoveIndex - 1].subNotes = [
        ...(this.rootNotes[noteToMoveIndex - 1].subNotes ?? []),
        noteToMove,
      ];
      this.rootNotes.splice(noteToMoveIndex, 1);
      this.subNotes = this.rootNotes[noteToMoveIndex - 1].subNotes ?? [];
      this.opened = true;
      this.selectedNoteId = this.rootNotes[noteToMoveIndex - 1].id;
      this.selectedSubNoteId = noteId;
      this.storePosition();
    });

    this.authService.authenticated?.subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        return;
      }

      this.noteService.loading = true;

      this.persistenceService
        .loadNotes()
        .then((notes) => {
          this.rootNotes = notes;
        })
        .finally(() => {
          this.noteService.loading = false;
        });
    });
  }

  noteSelected(noteId: string): void {
    this.selectedNoteId = noteId;
    this.selectedSubNoteId = '';
    const rootNoteIndex = this.rootNotes.findIndex(
      (rn) => rn.id === this.selectedNoteId
    );
    const rootNote = this.rootNotes.find((rn) => rn.id === this.selectedNoteId);
    this.subNotes = rootNote?.subNotes ?? [];
    this.opened = this.subNotes.length > 0;

    this.displayNote = rootNote ?? null;
    this.noteService.selectedNoteId = rootNote?.id ?? null;
    this.noteService.selectedNoteCanBeSub =
      rootNote?.subNotes?.length === 0 && rootNoteIndex !== 0;
  }

  subNoteSelected(noteId: string): void {
    this.selectedSubNoteId = noteId;
    this.displayNote =
      this.rootNotes
        .find((rn) => rn.id === this.selectedNoteId)
        ?.subNotes?.find((sn) => sn.id === noteId) ?? null;
    this.noteService.selectedNoteId = this.displayNote?.id ?? null;
    this.noteService.selectedNoteCanBeSub = false;
  }

  dropOntoRoot(event: CdkDragDrop<Note[]>): void {
    if (event.previousContainer === event.container) {
      // Simple reorder on root
      moveItemInArray(this.rootNotes, event.previousIndex, event.currentIndex);
    } else {
      // Transfer from sub to root
      transferArrayItem(
        this.subNotes,
        this.rootNotes,
        event.previousIndex,
        event.currentIndex
      );
      const rootNote = this.rootNotes.find(
        (rn) => rn.id === this.selectedNoteId
      );
      this.opened = (rootNote?.subNotes?.length ?? 0) > 0;
    }
    if (event.currentIndex > 0) {
      this.noteService.selectedNoteCanBeSub =
        this.rootNotes[event.currentIndex].subNotes?.length === 0;
    } else {
      this.noteService.selectedNoteCanBeSub = false;
    }
    this.storePosition();
  }

  dropOntoSub(event: CdkDragDrop<Note[]>): void {
    if (event.previousContainer === event.container) {
      // Simple reorder on sub
      moveItemInArray(this.subNotes, event.previousIndex, event.currentIndex);
    } else {
      // Transfer from Root to sub
      if (this.rootNotes[event.previousIndex].id === this.selectedNoteId) {
        this.snackBar.open(
          `📝 ☝️ Note can't be it's own sub note! ❌❌❌ `,
          '',
          {
            duration: 3000,
          }
        );
        return;
      }
      transferArrayItem(
        this.rootNotes,
        this.subNotes,
        event.previousIndex,
        event.currentIndex
      );
      this.noteService.selectedNoteCanBeSub = false;
    }
    this.storePosition();
  }

  private storePosition(): void {
    this.rootNotes.forEach((rn, index) => {
      rn.position = index;
      if ((rn.subNotes?.length ?? 0) > 0) {
        rn.subNotes?.forEach((sn, jndex) => {
          sn.position = jndex;
        });
      }
    });
    this.noteService.loading = true;
    this.persistenceService.saveAllNotes(this.rootNotes).finally(() => {
      this.noteService.loading = false;
    });
  }
}
