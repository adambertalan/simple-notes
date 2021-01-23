import { Note } from 'src/app/models/note.model';
import { User } from 'src/app/models/user.model';

export interface NotesState {
  rootNotes: Note[];
  subNotes: Note[];
  selectedRootNoteId: string;
  selectedSubNoteId: string;
  subNotesOpen: boolean;
  isMoveToSubEnabled: boolean;
  loading: boolean;
  displayNoteId: string;
  displayNoteTitle: string;
  displayNoteContent: string;
  errorMessage: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginErrorMessage: string;
  signupErrorMessage: string;
  loading: boolean;
}

export interface AppState {
  notes: NotesState;
  auth: AuthState;
}
