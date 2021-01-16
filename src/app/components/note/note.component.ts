import { NoteService } from './../../services/note.service';
import { PersistenceService } from './../../services/persistence.service';
import { Subject } from 'rxjs';
import { Note } from './../../models/note.model';
import { Component, Input, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  @Input() parentId: string | null = null;
  @Input() note: Note | null = null;

  titleChangeSubj: Subject<string> = new Subject<string>();
  contentChangeSubj: Subject<string> = new Subject<string>();

  saveTitle = this.titleChangeSubj.pipe(
    filter((text) => text.length > 0),
    distinctUntilChanged(),
    debounceTime(500)
  );

  saveContent = this.contentChangeSubj.pipe(
    filter((text) => text.length > 0),
    distinctUntilChanged(),
    debounceTime(500)
  );

  constructor(
    private noteSerivce: NoteService,
    private persistenceService: PersistenceService
  ) {}

  ngOnInit(): void {
    this.saveTitle.subscribe((title) => {
      if (!this.note) {
        return;
      }
      this.note.title = title;
      this.noteSerivce.loading = true;
      if (this.parentId) {
        this.persistenceService
          .updateSubNote(this.parentId, this.note)
          .finally(() => {
            this.noteSerivce.loading = false;
          });
      } else {
        this.persistenceService.updateRootNote(this.note).finally(() => {
          this.noteSerivce.loading = false;
        });
      }
    });

    this.saveContent.subscribe((content) => {
      if (!this.note) {
        return;
      }
      this.note.content = content;
      this.noteSerivce.loading = true;
      if (this.parentId) {
        this.persistenceService
          .updateSubNote(this.parentId, this.note)
          .finally(() => {
            this.noteSerivce.loading = false;
          });
      } else {
        this.persistenceService.updateRootNote(this.note).finally(() => {
          this.noteSerivce.loading = false;
        });
      }
    });
  }

  titleChange(target: EventTarget | null): void {
    this.titleChangeSubj.next((target as HTMLInputElement).value);
  }

  contentChange(target: EventTarget | null): void {
    this.contentChangeSubj.next((target as HTMLTextAreaElement).value);
  }
}
