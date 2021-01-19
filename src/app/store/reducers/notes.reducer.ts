import {
  selectRootNote,
  selectSubNote,
  NotesActions,
  loadNotesSuccess,
  loadNotesFail,
} from './../actions/notes.actions';
import { Note } from 'src/app/models/note.model';
import { ActionReducer, createReducer, on, State } from '@ngrx/store';

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

export const initialState: NotesState = {
  rootNotes: [],
  subNotes: [],
  selectedRootNoteId: '',
  selectedSubNoteId: '',
  subNotesOpen: false,
  isMoveToSubEnabled: false,
  loading: false,
  displayNoteId: '',
  displayNoteTitle: '',
  displayNoteContent: '',
  errorMessage: '',
};

/* tslint:disable */
const _notesReducer: ActionReducer<NotesState, NotesActions> = createReducer(
  initialState,
  on(selectRootNote, (state: NotesState, { noteId }) => {
    return {
      ...state,
      // rootNotes // Remains the same
      // subNotes // TODO
      selectedRootNoteId: noteId,
      selectedSubNoteId: '',
      // subNotesOpen // TODO
      // isMoveToSubEnabled // TODO
      displayNoteId: noteId,
      // displayNoteTitle // TODO
      // displayNoteContent // TODO
      errorMessage: '',
    };
  }),
  on(selectSubNote, (state: NotesState, { noteId }) => {
    return {
      ...state,
      // rootNotes // Remains the same
      // subNotes // Remains the same
      // selectedRootNoteId // Remains the same
      selectedSubNoteId: noteId,
      // subNotesOpen // Remains the same
      isMoveToSubEnabled: false,
      displayNoteId: noteId,
      // displayNoteTitle // TODO
      // displayNoteContent // TODO
      errorMessage: '',
    };
  }),
  on(loadNotesSuccess, (state: NotesState, { notes }) => {
    return {
      ...state,
      rootNotes: [...notes],
      subNotes: [],
      selectedRootNoteId: '',
      selectedSubNoteId: '',
      subNotesOpen: false,
      isMoveToSubEnabled: false,
      displayNoteId: '',
      displayNoteTitle: '',
      displayNoteContent: '',
      errorMessage: '',
    };
  }),
  on(loadNotesFail, (state: NotesState, { errorMessage }) => {
    return {
      ...state,
      rootNotes: [],
      subNotes: [],
      selectedRootNoteId: '',
      selectedSubNoteId: '',
      subNotesOpen: false,
      isMoveToSubEnabled: false,
      displayNoteId: '',
      displayNoteTitle: '',
      displayNoteContent: '',
      errorMessage,
    };
  })
);

export function notesReducer(
  state: NotesState = initialState,
  action: NotesActions
): NotesState {
  return _notesReducer(state, action);
}
