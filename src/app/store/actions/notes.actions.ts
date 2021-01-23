import { Action, createAction, props } from '@ngrx/store';
import { Note } from 'src/app/models/note.model';

export enum NoteActionTypes {
  SELECT_ROOT_NOTE_ACTION = 'SELECT_ROOT_NOTE',
  SELECT_SUB_NOTE = 'SELECT_SUB_NOTE',

  DB_OPERATION_FAIL = 'DB_OPERATION_FAIL',

  START_LOAD_NOTES = 'START_LOAD_NOTES',
  LOAD_NOTES_SUCCESS = 'LOAD_NOTES_SUCCESS',

  START_SAVE_NOTES = 'START_SAVE_NOTES',
  SAVE_NOTES_SUCCESS = 'SAVE_NOTES_SUCCESS',

  START_ADD_ROOT_NOTE = 'START_ADD_ROOT_NOTE',
  ADD_ROOT_NOTE_SUCCESS = 'ADD_ROOT_NOTE_SUCCESS',

  START_UPDATE_ROOT_NOTE = 'START_UPDATE_ROOT_NOTE',
  UPDATE_ROOT_NOTE_SUCCESS = 'UPDATE_ROOT_NOTE_SUCCESS',

  START_REMOVE_ROOT_NOTE = 'START_REMOVE_ROOT_NOTE',
  REMOVE_ROOT_NOTE_SUCCESS = 'REMOVE_ROOT_NOTE_SUCCESS',

  START_UPDATE_SUB_NOTE = 'START_UPDATE_SUB_NOTE',
  UPDATE_SUB_NOTE_SUCCESS = 'UPDATE_SUB_NOTE_SUCCESS',

  START_REMOVE_SUB_NOTE = 'START_REMOVE_SUB_NOTE',
  REMOVE_SUB_NOTE_SUCCESS = 'REMOVE_SUB_NOTE_SUCCESS',

  REORDER_ROOT_NOTES = 'REORDER_ROOT_NOTES',
  REORDER_SUB_NOTES = 'REORDER_SUB_NOTES',
  MOVE_SUB_NOTE_TO_ROOT = 'MOVE_SUB_NOTE_TO_ROOT',
  MOVE_ROOT_NOTE_TO_SUB = 'MOVE_ROOT_NOTE_TO_SUB',
}

export class DBOperationFail implements Action {
  readonly type: string = NoteActionTypes.DB_OPERATION_FAIL;
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

export class StartSaveNotes implements Action {
  readonly type: string = NoteActionTypes.START_SAVE_NOTES;
}

export class SaveNotesSuccess implements Action {
  readonly type: string = NoteActionTypes.SAVE_NOTES_SUCCESS;
}

export class StartAddRootNote implements Action {
  readonly type: string = NoteActionTypes.START_ADD_ROOT_NOTE;
}

export class AddRootNoteSuccess implements Action {
  readonly type: string = NoteActionTypes.ADD_ROOT_NOTE_SUCCESS;
}

export class StartUpdateRootNote implements Action {
  readonly type: string = NoteActionTypes.START_UPDATE_ROOT_NOTE;
}

export class UpdateRootNoteSuccess implements Action {
  readonly type: string = NoteActionTypes.UPDATE_ROOT_NOTE_SUCCESS;
}

export class StartRemoveRootNote implements Action {
  readonly type: string = NoteActionTypes.START_REMOVE_ROOT_NOTE;
}

export class RemoveRootNoteSuccess implements Action {
  readonly type: string = NoteActionTypes.REMOVE_ROOT_NOTE_SUCCESS;
}

export class StartUpdateSubNote implements Action {
  readonly type: string = NoteActionTypes.START_UPDATE_ROOT_NOTE;
}

export class UpdateSubNoteSuccess implements Action {
  readonly type: string = NoteActionTypes.UPDATE_SUB_NOTE_SUCCESS;
}

export class StartRemoveSubNote implements Action {
  readonly type: string = NoteActionTypes.START_REMOVE_SUB_NOTE;
}

export class RemoveSubNoteSuccess implements Action {
  readonly type: string = NoteActionTypes.REMOVE_SUB_NOTE_SUCCESS;
}

export class ReorderRootNotes implements Action {
  readonly type: string = NoteActionTypes.REORDER_ROOT_NOTES;
}

export class ReorderSubNotes implements Action {
  readonly type: string = NoteActionTypes.REORDER_SUB_NOTES;
}

export class MoveSubNoteToRoot implements Action {
  readonly type: string = NoteActionTypes.MOVE_SUB_NOTE_TO_ROOT;
}

export class MoveRootNoteToSub implements Action {
  readonly type: string = NoteActionTypes.MOVE_ROOT_NOTE_TO_SUB;
}

export const dbOperationFail = createAction(
  NoteActionTypes.DB_OPERATION_FAIL,
  props<{ errorMessage: string }>()
);
export const selectRootNote = createAction(
  NoteActionTypes.SELECT_ROOT_NOTE_ACTION,
  props<{ note: Note }>()
);
export const selectSubNote = createAction(
  NoteActionTypes.SELECT_SUB_NOTE,
  props<{ note: Note }>()
);
export const startLoadNotes = createAction(NoteActionTypes.START_LOAD_NOTES);
export const loadNotesSuccess = createAction(
  NoteActionTypes.LOAD_NOTES_SUCCESS,
  props<{ notes: Note[] }>()
);
export const startSaveNotes = createAction(
  NoteActionTypes.START_SAVE_NOTES,
  props<{ notes: Note[] }>()
);
export const saveNotesSuccess = createAction(
  NoteActionTypes.SAVE_NOTES_SUCCESS,
  props<{ savedNotes: Note[] }>()
);
export const startAddRootNote = createAction(
  NoteActionTypes.START_ADD_ROOT_NOTE,
  props<{ title: string; content: string; position: number }>()
);
export const addRootNoteSuccess = createAction(
  NoteActionTypes.ADD_ROOT_NOTE_SUCCESS,
  props<{ savedNote: Note }>()
);
export const startUpdateRootNote = createAction(
  NoteActionTypes.START_UPDATE_ROOT_NOTE,
  props<{ note: Note }>()
);
export const updateRootNoteSuccess = createAction(
  NoteActionTypes.UPDATE_ROOT_NOTE_SUCCESS,
  props<{ updatedNote: Note }>()
);
export const startRemoveRootNote = createAction(
  NoteActionTypes.START_REMOVE_ROOT_NOTE,
  props<{ noteId: string }>()
);
export const removeRootNoteSuccess = createAction(
  NoteActionTypes.REMOVE_ROOT_NOTE_SUCCESS,
  props<{ removedId: string }>()
);
export const startUpdateSubNote = createAction(
  NoteActionTypes.START_UPDATE_SUB_NOTE,
  props<{ parentNoteId: string; note: Note }>()
);
export const updateSubNoteSuccess = createAction(
  NoteActionTypes.UPDATE_SUB_NOTE_SUCCESS,
  props<{ parentNoteId: string; updatedNote: Note }>()
);
export const startRemoveSubNote = createAction(
  NoteActionTypes.START_REMOVE_SUB_NOTE,
  props<{ parentNoteId: string; noteId: string }>()
);
export const removeSubNoteSuccess = createAction(
  NoteActionTypes.REMOVE_SUB_NOTE_SUCCESS,
  props<{ parentNoteId: string; removedNoteId: string }>()
);
export const reorderRootNotes = createAction(
  NoteActionTypes.REORDER_ROOT_NOTES,
  props<{ fromIndex: number; toIndex: number }>()
);
export const reorderSubNotes = createAction(
  NoteActionTypes.REORDER_SUB_NOTES,
  props<{ parentNoteId: string; fromIndex: number; toIndex: number }>()
);
export const moveSubNoteToRoot = createAction(
  NoteActionTypes.MOVE_SUB_NOTE_TO_ROOT,
  props<{ subNoteIndex: number; subNoteParentId: string; rootIndex: number }>()
);
export const moveRootNoteToSub = createAction(
  NoteActionTypes.MOVE_ROOT_NOTE_TO_SUB,
  props<{
    rootNoteIndex: number;
    subNoteIndex: number;
    subNoteParentId: string;
  }>()
);

export type NotesActions =
  | SelectRootNote
  | SelectSubNote
  | StartLoadNotes
  | LoadNotesSuccess
  | StartSaveNotes
  | SaveNotesSuccess
  | StartAddRootNote
  | AddRootNoteSuccess
  | StartUpdateRootNote
  | UpdateRootNoteSuccess
  | StartRemoveRootNote
  | RemoveRootNoteSuccess
  | StartUpdateSubNote
  | UpdateSubNoteSuccess
  | StartRemoveSubNote
  | RemoveSubNoteSuccess
  | ReorderRootNotes
  | ReorderSubNotes
  | MoveSubNoteToRoot
  | MoveRootNoteToSub;
