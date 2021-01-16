export interface Note {
  id: string;
  title: string;
  position: number;
  content?: string;
  status?: string;
  subNotes?: Note[];
}
