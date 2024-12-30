import PlanetIcon from '../assets/svgs/planet.svg?react'
import Picker from '@emoji-mart/react'
import { Signal } from '@preact/signals-react'
import { Button, Popover } from 'react-aria-components'
import twemoji from 'twemoji'

type Props = {
  openPicker: Signal<boolean>
  emoji: Signal<string>
  emojiCode: Signal<string>
  color: Signal<string>
  imageUrl: Signal<string | ArrayBuffer | null>
  image: Signal<File | null>
}

function EmojiSelector({
  openPicker,
  emojiCode,
  emoji,
  color,
  imageUrl,
  image,
}: Props) {
  const emojiSelected = async (data: { unified: string }) => {
    const emojiImage = twemoji.parse(
      `https://twemoji.maxcdn.com/v/latest/72x72/${data.unified}.png`,
    )
    emojiCode.value = data.unified
    emoji.value = emojiImage
    imageUrl.value = null
    image.value = null
    openPicker.value = false
  }

  if (!openPicker) return null
  return (
    <Popover>
      <Button
        className={`${
          color.value && `bg-${color.value}-500`
        } btn btn-square btn-lg`}
      >
        {emoji.value && <img src={emoji.value} width={42} height={42} alt="" />}
        {!emoji.value && !imageUrl.value && (
          <PlanetIcon width={42} height={42} />
        )}
        {typeof imageUrl.value === 'string' && imageUrl.value && (
          <img src={imageUrl?.value} width={42} height={42} alt="" />
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
  )
}

export default EmojiSelector
