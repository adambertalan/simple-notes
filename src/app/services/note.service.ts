import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  selectedNoteId: string | null = null;
  selectedNoteCanBeSub = false;

  createNote = new Subject<void>();
  deleteNote = new Subject<string>();
  moveToSubNote = new Subject<string>();

  loading = false;

  constructor() {}
}
