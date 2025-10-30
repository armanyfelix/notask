import { FlashMessageContext } from "./editor/context/FlashMessageContext";
import { SettingsContext } from "./editor/context/SettingsContext";
import NoteLayout from "./NoteLayout";

export default function Note(): JSX.Element {
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
