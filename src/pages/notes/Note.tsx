import { FlashMessageContext } from "./editor/context/FlashMessageContext";
import { SettingsContext } from "./editor/context/SettingsContext";
import NoteLayout from "./NoteLayout";

export default function Note() {
  return (
    <SettingsContext>
      <FlashMessageContext>
        <div>
          <NoteLayout />
        </div>
      </FlashMessageContext>
    </SettingsContext>
  );
}
