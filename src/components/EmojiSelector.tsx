import PlanetIcon from "../assets/svgs/planet.svg?react";
import Picker from "@emoji-mart/react";
import { Button, Popover } from "react-aria-components";
import twemoji from "twemoji";

type Props = {
  openPicker: boolean;
  setOpenPicker: (value: boolean) => void;
  emoji: string;
  setEmoji: (value: string) => void;
  emojiCode: string;
  setEmojiCode: (value: string) => void;
  color: string;
  imageUrl: string | ArrayBuffer | null;
  setImageUrl: (value: string | ArrayBuffer | null) => void;
  image: File | null;
  setImage: (value: File | null) => void;
};

function EmojiSelector({
  openPicker,
  setOpenPicker,
  emojiCode,
  setEmojiCode,
  emoji,
  setEmoji,
  color,
  imageUrl,
  setImageUrl,
  image,
  setImage,
}: Props) {
  const emojiSelected = async (data: { unified: string }) => {
    const emojiImage = twemoji.parse(
      `https://twemoji.maxcdn.com/v/latest/72x72/${data.unified}.png`,
    );
    setEmojiCode(data.unified);
    setEmoji(emojiImage);
    setImageUrl(null);
    setImage(null);
    setOpenPicker(false);
  };

  if (!openPicker) return null;
  return (
    <Popover>
      <Button className={`${color && `bg-${color}-500`} btn btn-square btn-lg`}>
        {emoji && <img src={emoji} width={42} height={42} alt="" />}
        {!emoji && !imageUrl && <PlanetIcon width={42} height={42} />}
        {typeof imageUrl === "string" && imageUrl && (
          <img src={imageUrl} width={42} height={42} alt="" />
        )}
      </Button>
      {/* <Popover.Panel className="absolute z-50">
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
