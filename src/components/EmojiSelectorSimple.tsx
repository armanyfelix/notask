import FolderIcon from "../assets/svgs/folder.svg?react";
import ListIcon from "../assets/svgs/list.svg?react";
import FileIcon from "../assets/svgs/file.svg?react";
import Picker from "@emoji-mart/react";
import twemoji from "twemoji";
import { Button, Popover } from "react-aria-components";

interface Props {
  emoji: string;
  setEmoji: (value: string) => void;
  emojiCode: string;
  setEmojiCode: (value: string) => void;
  defaultIcon: string;
}

function EmojiSelector({
  emojiCode,
  setEmojiCode,
  emoji,
  setEmoji,
  defaultIcon,
}: Props) {
  const emojiSelected = async (data: { unified: string }) => {
    const emojiImage = twemoji.parse(
      `https://twemoji.maxcdn.com/v/latest/72x72/${data.unified}.png`,
    );
    setEmojiCode(data.unified);
    setEmoji(emojiImage);
  };

  const handleBrokenImage = (e: any) => {
    e.currentTarget.src =
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f1e6.png";
    e.currentTarget.onerror = null;
  };

  return (
    <Popover>
      <Button className="btn join-item z-50 rounded-r-box brightness-105">
        {emoji ? (
          <img
            src={emoji}
            onError={handleBrokenImage}
            width={24}
            height={24}
            alt=""
          />
        ) : (
          <>
            {defaultIcon === "folder" && <FolderIcon />}
            {defaultIcon === "list" && <ListIcon />}
            {defaultIcon === "file" && <FileIcon />}
          </>
        )}
      </Button>
      {/*
        <Popover.Panel className="absolute z-50">
          {({ close }) => (
            <div onClick={(e) => e.stopPropagation()}>
              <Picker
                set="twitter"
                styles={{ background: 'transparent' }}
                onEmojiSelect={(e: { unified: string }) => {
                  emojiSelected(e)
                  close()
                }}
                theme="auto"
              />
            </div>
          )}
        </Popover.Panel> */}
    </Popover>
  );
}

export default EmojiSelector;
