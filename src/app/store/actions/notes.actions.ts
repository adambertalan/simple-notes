import { Action, createAction, props } from '@ngrx/store';
import { Note } from 'src/app/models/note.model';

export enum NoteActionTypes {
  SELECT_ROOT_NOTE_ACTION = 'SELECT_ROOT_NOTE_ACTION',
  SELECT_SUB_NOTE = 'SELECT_SUB_NOTE',
  START_LOAD_NOTES = 'START_LOAD_NOTES',
  LOAD_NOTES_SUCCESS = 'LOAD_NOTES_SUCCESS',
  LOAD_NOTES_FAIL = 'LOAD_NOTES_FAIL',
}

export class SelectRootNote implements Action {
  readonly type: string = NoteActionTypes.SELECT_ROOT_NOTE_ACTION;
}

export class SelectSubNote implements Action {
  readonly type: string = NoteActionTypes.SELECT_SUB_NOTE;
}

export class StartLoadNotes implements Action {
  readonly type: string = NoteActionTypes.START_LOAD_NOTES;
}

export class LoadNotesSuccess implements Action {
  readonly type: string = NoteActionTypes.LOAD_NOTES_SUCCESS;
}

export class LoadNotesFail implements Action {
  readonly type: string = NoteActionTypes.LOAD_NOTES_FAIL;
}

export const selectRootNote = createAction(
  NoteActionTypes.SELECT_ROOT_NOTE_ACTION,
  props<{ noteId: string }>()
);
export const selectSubNote = createAction(
  NoteActionTypes.SELECT_SUB_NOTE,
  props<{ noteId: string }>()
);
export const startLoadNotes = createAction(NoteActionTypes.START_LOAD_NOTES);
export const loadNotesSuccess = createAction(
  NoteActionTypes.LOAD_NOTES_SUCCESS,
  props<{ notes: Note[] }>()
);
export const loadNotesFail = createAction(
  NoteActionTypes.LOAD_NOTES_FAIL,
  props<{ errorMessage: string }>()
);

export type NotesActions =
  | SelectRootNote
  | SelectSubNote
  | StartLoadNotes
  | LoadNotesSuccess
  | LoadNotesFail;
