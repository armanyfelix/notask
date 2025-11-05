/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import "./index.css";

import { $isCodeHighlightNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  getDOMSelection,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import { createPortal } from "react-dom";

import { getDOMRangeRect } from "../../utils/getDOMRangeRect";
import { getSelectedNode } from "../../utils/getSelectedNode";
import { setFloatingElemPosition } from "../../utils/setFloatingElemPosition";
import { INSERT_INLINE_COMMAND } from "../CommentPlugin";

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isUppercase,
  isLowercase,
  isCapitalize,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isLink: boolean;
  isUppercase: boolean;
  isLowercase: boolean;
  isCapitalize: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isUnderline: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);

  const insertComment = () => {
    editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  function mouseMoveListener(e: MouseEvent) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "none") {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = "none";
        }
      }
    }
  }
  function mouseUpListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "auto") {
        popupCharStylesEditorRef.current.style.pointerEvents = "auto";
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener("mousemove", mouseMoveListener);
      document.addEventListener("mouseup", mouseUpListener);

      return () => {
        document.removeEventListener("mousemove", mouseMoveListener);
        document.removeEventListener("mouseup", mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = getDOMSelection(editor._window);

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(
        rangeRect,
        popupCharStylesEditorElem,
        anchorElem,
        isLink,
      );
    }
  }, [editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener("resize", update);
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  return (
    <div
      ref={popupCharStylesEditorRef}
      className="flex p-1 dialog align-middle absolute top-0 left-0 z-10"
    >
      {editor.isEditable() && (
        <>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isBold && "btn-active"}`}
            title="Bold"
            aria-label="Format text as bold"
          >
            <span className="icon-[tabler--bold] size-5"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isItalic && "btn-active"}`}
            title="Italic"
            aria-label="Format text as italics"
          >
            <span className="icon-[tabler--italic] size-5"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isUnderline && "btn-active"}`}
            title="Underline"
            aria-label="Format text to underlined"
          >
            <span className="icon-[tabler--underline] size-5"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isStrikethrough && "btn-active"}`}
            title="Strikethrough"
            aria-label="Format text with a strikethrough"
          >
            <span className="icon-[tabler--strikethrough] size-5"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isSubscript && "btn-active"}`}
            title="Subscript"
            aria-label="Format Subscript"
          >
            <span className="icon-[tabler--subscript] size-5"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isSuperscript && "btn-active"}`}
            title="Superscript"
            aria-label="Format Superscript"
          >
            <span className="icon-[tabler--superscript] size-5"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "uppercase");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isUppercase && "btn-active"}`}
            title="Uppercase"
            aria-label="Format text to uppercase"
          >
            <span className="icon-[tabler--letter-case-upper] size-5"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "lowercase");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isLowercase && "btn-active"}`}
            title="Lowercase"
            aria-label="Format text to lowercase"
          >
            <span className="icon-[tabler--letter-case-lower] size-5"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "capitalize");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isCapitalize && "btn-active"}`}
            title="Capitalize"
            aria-label="Format text to capitalize"
          >
            <span className="icon-[tabler--letter-case] size-5"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            className={`btn btn-sm btn-square btn-ghost ${isCode && "btn-active"}`}
            title="Insert code block"
            aria-label="Insert code block"
          >
            <span className="icon-[tabler--code] size-5"></span>
          </button>
          <button
            type="button"
            onClick={insertLink}
            className={`btn btn-sm btn-square btn-ghost ${isLink && "btn-active"}`}
            title="Insert link"
            aria-label="Insert link"
          >
            <span className="icon-[tabler--link] size-5"></span>
          </button>
        </>
      )}
      <button
        type="button"
        onClick={insertComment}
        className={`btn btn-sm btn-square btn-ghost`}
        title="Insert comment"
        aria-label="Insert comment"
      >
        <span className="icon-[tabler--message] size-5"></span>
      </button>
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  setIsLinkEditMode: Dispatch<boolean>,
): JSX.Element | null {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isLowercase, setIsLowercase] = useState(false);
  const [isCapitalize, setIsCapitalize] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsUppercase(selection.hasFormat("uppercase"));
      setIsLowercase(selection.hasFormat("lowercase"));
      setIsCapitalize(selection.hasFormat("capitalize"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));

      // Update links
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ""
      ) {
        setIsText($isTextNode(node) || $isParagraphNode(node));
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, "");
      if (!selection.isCollapsed() && rawTextContent === "") {
        setIsText(false);
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isUppercase={isUppercase}
      isLowercase={isLowercase}
      isCapitalize={isCapitalize}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      isCode={isCode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem,
  );
}

export default function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
  setIsLinkEditMode,
}: {
  anchorElem?: HTMLElement;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem, setIsLinkEditMode);
}
