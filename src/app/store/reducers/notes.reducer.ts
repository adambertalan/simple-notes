import {
  selectRootNote,
  selectSubNote,
  NotesActions,
  loadNotesSuccess,
  startSaveNotes,
  saveNotesSuccess,
  startAddRootNote,
  addRootNoteSuccess,
  startUpdateRootNote,
  updateRootNoteSuccess,
  startRemoveRootNote,
  removeRootNoteSuccess,
  startUpdateSubNote,
  updateSubNoteSuccess,
  startRemoveSubNote,
  removeSubNoteSuccess,
  reorderRootNotes,
  reorderSubNotes,
  moveSubNoteToRoot,
  moveRootNoteToSub,
  startLoadNotes,
  dbOperationFail,
} from './../actions/notes.actions';
import { Note } from 'src/app/models/note.model';
import { ActionReducer, createReducer, on } from '@ngrx/store';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { NotesState } from './app.state';

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

const previousStateWithoutLoadingWithError = (
  state: NotesState,
  action: { errorMessage: string }
) => {
  const newState: NotesState = {
    ...state,
    rootNotes: [...state.rootNotes],
    subNotes: [...state.subNotes],
    loading: false,
    errorMessage: action.errorMessage,
  };
  return newState;
};

const previousStateWithLoading = (state: NotesState) => {
  const newState: NotesState = {
    ...state,
    rootNotes: [...state.rootNotes],
    subNotes: [...state.subNotes],
    loading: true,
    errorMessage: '',
  };
  return newState;
};

const updatePositions = (notes: Note[]): Note[] => {
  return notes.map((n, index) => {
    const updated = {
      ...n,
    };
    if (n.subNotes?.length) {
      updated.subNotes = [...n.subNotes];
    }
    updated.position = index;
    return updated;
  });
};

/* tslint:disable */
const _notesReducer: ActionReducer<NotesState, NotesActions> = createReducer(
  initialState,
  on(dbOperationFail, previousStateWithoutLoadingWithError),
  on(startLoadNotes, previousStateWithLoading),
  on(loadNotesSuccess, (state: NotesState, { notes }) => {
    const newState: NotesState = {
      ...state,
      rootNotes: [...notes],
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
    return newState;
  }),
  on(selectRootNote, (state: NotesState, { note }) => {
    const noteIndex = state.rootNotes.findIndex((n) => n.id === note.id);
    const subNotes = [...(note.subNotes ?? [])];

    return {
      ...state,
      rootNotes: [...state.rootNotes],
      subNotes: subNotes,
      selectedRootNoteId: note.id,
      selectedSubNoteId: '',
      subNotesOpen: subNotes.length > 0,
      isMoveToSubEnabled: noteIndex > 0 && subNotes.length === 0,
      loading: false,
      displayNoteId: note.id,
      displayNoteTitle: note.title,
      displayNoteContent: note.content ?? '',
      errorMessage: '',
    };
  }),
  on(selectSubNote, (state: NotesState, { note }) => {
    const newState: NotesState = {
      rootNotes: [...state.rootNotes],
      subNotes: [...state.subNotes],
      selectedRootNoteId: state.selectedRootNoteId,
      selectedSubNoteId: note.id,
      subNotesOpen: true,
      isMoveToSubEnabled: false,
      loading: false,
      displayNoteId: note.id,
      displayNoteTitle: note.title,
      displayNoteContent: note.content ?? '',
      errorMessage: '',
    };

    return newState;
  }),
  on(startAddRootNote, previousStateWithLoading),
  on(addRootNoteSuccess, (state: NotesState, { savedNote }) => {
    // Insert new note into the array to the correct position
    let newRootNotes = [...state.rootNotes];
    newRootNotes.splice(savedNote.position, 0, savedNote);

    newRootNotes = updatePositions(newRootNotes);

    const newState: NotesState = {
      ...state,
      rootNotes: newRootNotes,
      subNotes: [],
      subNotesOpen: false,
      selectedRootNoteId: savedNote.id,
      selectedSubNoteId: '',
      loading: false,
      isMoveToSubEnabled: savedNote.position > 0,
      displayNoteId: savedNote.id,
      displayNoteTitle: savedNote.title,
      displayNoteContent: savedNote.content ?? '',
    };
    return newState;
  }),
  on(startSaveNotes, previousStateWithLoading),
  on(saveNotesSuccess, (state: NotesState, { savedNotes }) => {
    const newState: NotesState = {
      ...state,
      rootNotes: [...savedNotes],
      subNotes: [...state.subNotes],
      loading: false,
      errorMessage: '',
    };
    return newState;
  }),
  on(startRemoveRootNote, previousStateWithLoading),
  on(removeRootNoteSuccess, (state: NotesState, { removedId }) => {
    let newRootNotes = state.rootNotes.filter((n) => n.id !== removedId);

    newRootNotes = updatePositions(newRootNotes);

    const newState: NotesState = {
      ...state,
      rootNotes: newRootNotes,
      subNotes: [],
      subNotesOpen: false,
      selectedRootNoteId: '',
      selectedSubNoteId: '',
      loading: false,
      isMoveToSubEnabled: false,
      displayNoteId: '',
      displayNoteTitle: '',
      displayNoteContent: '',
    };
    return newState;
  }),
  on(startRemoveSubNote, previousStateWithLoading),
  on(
    removeSubNoteSuccess,
    (state: NotesState, { parentNoteId, removedNoteId }) => {
      let updatedSubNotes = state.subNotes.filter(
        (n) => n.id !== removedNoteId
      );

      const hasSubNotes = updatedSubNotes.length > 0;

      updatedSubNotes = updatePositions(updatedSubNotes);

      const updatedRootNote = state.rootNotes.find(
        (n) => n.id === parentNoteId
      );
      if (!updatedRootNote) {
        return {
          ...state,
          errorMessage: 'Could not find the note that should be removed!',
        };
      }

      const updatedRootNotes = state.rootNotes.map((rn) => {
        if (rn.id === parentNoteId) {
          return {
            ...rn,
            subNotes: updatedSubNotes,
          };
        }
        return rn;
      });

      const newState: NotesState = {
        ...state,
        rootNotes: updatedRootNotes,
        subNotes: updatedSubNotes,
        subNotesOpen: hasSubNotes,
        selectedRootNoteId: updatedRootNote.id,
        selectedSubNoteId: '',
        loading: false,
        isMoveToSubEnabled: hasSubNotes ? false : updatedRootNote.position > 0,
        displayNoteId: hasSubNotes ? '' : updatedRootNote.id,
        displayNoteTitle: hasSubNotes ? '' : updatedRootNote.title,
        displayNoteContent: hasSubNotes ? '' : updatedRootNote.content ?? '',
      };
      return newState;
    }
  ),
  on(
    moveRootNoteToSub,
    (state: NotesState, { rootNoteIndex, subNoteIndex, subNoteParentId }) => {
      const targetRootNote = state.rootNotes.find(
        (rn) => rn.id === subNoteParentId
      );
      if (!targetRootNote) {
        return {
          ...state,
          errorMessage: 'Cannot move note to the subnotes!',
        };
      }
      const rootNoteToMove = state.rootNotes[rootNoteIndex];

      if (rootNoteToMove.subNotes?.length) {
        return {
          ...state,
          errorMessage: `📝 ☝️ Note can't be it's own sub note! ❌❌❌ `,
        };
      }

      // Move selected root note to parent's children
      let newSubNotes = [...(targetRootNote.subNotes ?? [])];
      newSubNotes.splice(subNoteIndex, 0, {
        ...rootNoteToMove,
        // Update position of moved note
        position: subNoteIndex,
      });

      // Update positions of subnotes
      newSubNotes = updatePositions(newSubNotes);

      // Remove moved note from root notes
      let updatedRootNotes = state.rootNotes.filter(
        (rn) => rn.id !== rootNoteToMove.id
      );
      updatedRootNotes = updatedRootNotes.map((rn) => {
        if (rn.id === targetRootNote.id) {
          return {
            ...targetRootNote,
            subNotes: newSubNotes,
          };
        }
        return rn;
      });

      // Update position of root notes!
      updatedRootNotes = updatePositions(updatedRootNotes);

      const wasRootNoteSelected = state.displayNoteId === rootNoteToMove.id;

      const newState: NotesState = {
        ...state,
        rootNotes: updatedRootNotes,
        subNotes: newSubNotes,
        subNotesOpen: true,
        selectedRootNoteId: targetRootNote.id,
        selectedSubNoteId: wasRootNoteSelected
          ? rootNoteToMove.id
          : state.selectedSubNoteId,
        loading: false,
        isMoveToSubEnabled: false,
        errorMessage: '',
      };
      return newState;
    }
  ),
  on(
    moveSubNoteToRoot,
    (state: NotesState, { subNoteIndex, subNoteParentId, rootIndex }) => {
      const subNoteToMove = state.subNotes[subNoteIndex];
      const subNoteParent = state.rootNotes.find(
        (n) => n.id === subNoteParentId
      );

      if (!subNoteParent) {
        return {
          ...state,
          errorMessage: 'Cannot move sub note to root level!',
        };
      }

      let updatedSubNotes = state.subNotes.filter(
        (n) => n.id !== subNoteToMove.id
      );

      updatedSubNotes = updatePositions(updatedSubNotes);

      let updatedRootNotes = state.rootNotes.map((rn) => {
        if (rn.id === subNoteParentId) {
          return {
            ...rn,
            subNotes: updatedSubNotes,
          };
        }
        return rn;
      });

      updatedRootNotes.splice(rootIndex, 0, {
        ...subNoteToMove,
      });

      updatedRootNotes = updatePositions(updatedRootNotes);

      const wasMovedSubNoteSelected = state.displayNoteId === subNoteToMove.id;

      const newState: NotesState = {
        ...state,
        rootNotes: updatedRootNotes,
        subNotes: updatedSubNotes,
        subNotesOpen: wasMovedSubNoteSelected
          ? false
          : updatedSubNotes.length > 0,
        selectedRootNoteId: wasMovedSubNoteSelected
          ? subNoteToMove.id
          : state.selectedRootNoteId,
        selectedSubNoteId:
          wasMovedSubNoteSelected || updatedSubNotes.length === 0
            ? ''
            : state.selectedSubNoteId,
        loading: false,
        isMoveToSubEnabled: false,
        errorMessage: '',
      };
      return newState;
    }
  ),
  on(startUpdateRootNote, previousStateWithLoading),
  on(updateRootNoteSuccess, (state: NotesState, { updatedNote }) => {
    const updatedRootNotes = state.rootNotes.map((n) => {
      if (n.id === updatedNote.id) {
        return updatedNote;
      }
      return n;
    });
    const newState: NotesState = {
      ...state,
      rootNotes: updatedRootNotes,
      subNotes: [...state.subNotes],
      displayNoteTitle: updatedNote.title,
      displayNoteContent: updatedNote.content ?? '',
      loading: false,
    };
    return newState;
  }),
  on(startUpdateSubNote, previousStateWithLoading),
  on(
    updateSubNoteSuccess,
    (state: NotesState, { parentNoteId, updatedNote }) => {
      const updatedSubNotes = state.subNotes.map((n) => {
        if (n.id === updatedNote.id) {
          return updatedNote;
        }
        return n;
      });

      const updatedRootNotes = state.rootNotes.map((n) => {
        if (n.id === parentNoteId) {
          return {
            ...n,
            subNotes: updatedSubNotes,
          };
        }
        return n;
      });

      const newState: NotesState = {
        ...state,
        rootNotes: updatedRootNotes,
        subNotes: updatedSubNotes,
        displayNoteTitle: updatedNote.title,
        displayNoteContent: updatedNote.content ?? '',
        loading: false,
      };
      return newState;
    }
  ),
  on(reorderRootNotes, (state: NotesState, { fromIndex, toIndex }) => {
    let updatedRootNotes = [...state.rootNotes];
    moveItemInArray(updatedRootNotes, fromIndex, toIndex);

    updatedRootNotes = updatePositions(updatedRootNotes);

    const newState: NotesState = {
      ...state,
      rootNotes: updatedRootNotes,
      subNotes: [...state.subNotes],
      loading: false,
      isMoveToSubEnabled: toIndex > 0,
    };
    return newState;
  }),
  on(
    reorderSubNotes,
    (state: NotesState, { parentNoteId, fromIndex, toIndex }) => {
      let updatedSubNotes = [...state.subNotes];
      moveItemInArray(updatedSubNotes, fromIndex, toIndex);

      updatedSubNotes = updatePositions(updatedSubNotes);

      const updatedRootNotes = state.rootNotes.map((rn) => {
        if (rn.id === parentNoteId) {
          return {
            ...rn,
            subNotes: updatedSubNotes,
          };
        }
        return rn;
      });

      const newState: NotesState = {
        ...state,
        rootNotes: updatedRootNotes,
        subNotes: updatedSubNotes,
        loading: false,
        isMoveToSubEnabled: false,
      };
      return newState;
    }
  )
);

export function notesReducer(
  state: NotesState = initialState,
  action: NotesActions
): NotesState {
  return _notesReducer(state, action);
}
