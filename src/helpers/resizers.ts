import { MutableRef } from 'preact/hooks'

export function resizeLeft(
  refBox: MutableRef<HTMLElement | null>,
  refLeft: MutableRef<HTMLElement | null>,
) {
  const resizeableElement = refBox.current

  if (resizeableElement) {
    const styles = window.getComputedStyle(resizeableElement)
    let width = parseInt(styles.width, 10)
    let xCord = 0
    const onMouseMoveLeftResize = (e: any) => {
      const dx = e.clientX - xCord
      xCord = e.clientX
      width -= dx
      resizeableElement.style.width = `${width}px`
    }
    const onMouseUpLeftResize = () => {
      document.removeEventListener('mousemove', onMouseMoveLeftResize)
    }
    const onMouseDownLeftResize = (e: any) => {
      xCord = e.clientX
      resizeableElement.style.right = styles.right
      resizeableElement.style.left = ''
      document.addEventListener('mouseup', onMouseUpLeftResize)
      document.addEventListener('mousemove', onMouseMoveLeftResize)
    }

    const resizerLeft = refLeft.current as any
    resizerLeft.addEventListener('mousedown', onMouseDownLeftResize)

    return () => {
      resizerLeft.removeEventListener('mousedown', onMouseDownLeftResize)
    }
  }
}
