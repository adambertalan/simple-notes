import { createSelector } from '@ngrx/store';
import { AppState, NotesState } from './../reducers/app.state';

// Note: Not all selectors are stored here, some are used on the fly where needed.

const selectNote = (state: AppState) => state.notes;

export const selectDisplayNoteId = createSelector(
  selectNote,
  (state: NotesState) => state.displayNoteId
);

export const selectIsMoveToSubEnabled = createSelector(
  selectNote,
  (state: NotesState) => state.isMoveToSubEnabled
);

export const selectIsLoading = createSelector(
  selectNote,
  (state: NotesState) => state.loading
);

export const selectRootNotes = createSelector(
  selectNote,
  (state: NotesState) => state.rootNotes
);

export const selectSelectedRootNoteId = createSelector(
  selectNote,
  (state: NotesState) => state.selectedRootNoteId
);
