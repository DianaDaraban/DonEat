import { NoteType } from '../types/Note.ts';
import '../styles/Note.css';
interface NoteProps {
    note: NoteType;
    onDelete: (id: number) => void;
}
declare function Note({ note, onDelete }: NoteProps): import("react").JSX.Element;
export default Note;
//# sourceMappingURL=Notes.d.ts.map