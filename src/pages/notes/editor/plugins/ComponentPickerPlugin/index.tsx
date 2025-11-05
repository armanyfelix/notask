/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import { $createCodeNode } from "@lexical/code";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  TextNode,
} from "lexical";
import { useCallback, useMemo, useState } from "react";
import * as ReactDOM from "react-dom";

import useModal from "../../hooks/useModal";
import catTypingGif from "../../images/cat-typing.gif";
import { EmbedConfigs } from "../AutoEmbedPlugin";
import { INSERT_COLLAPSIBLE_COMMAND } from "../CollapsiblePlugin";
import { INSERT_DATETIME_COMMAND } from "../DateTimePlugin";
import { InsertEquationDialog } from "../EquationsPlugin";
import { INSERT_EXCALIDRAW_COMMAND } from "../ExcalidrawPlugin";
import { INSERT_IMAGE_COMMAND, InsertImageDialog } from "../ImagesPlugin";
import InsertLayoutDialog from "../LayoutPlugin/InsertLayoutDialog";
import { INSERT_PAGE_BREAK } from "../PageBreakPlugin";
import { InsertPollDialog } from "../PollPlugin";
import { InsertTableDialog } from "../TablePlugin";

class ComponentPickerOption extends MenuOption {
  // What shows up in the editor
  title: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    },
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function ComponentPickerMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: ComponentPickerOption;
}) {
  let className = "_item";
  if (isSelected) {
    className += " menu-active";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <button>
        {option.icon}
        {option.title}
        {/*<span className="text">{option.title}</span>*/}
      </button>
    </li>
  );
}

function getDynamicOptions(editor: LexicalEditor, queryString: string) {
  const options: Array<ComponentPickerOption> = [];
  if (queryString == null) {
    return options;
  }
  const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/);
  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2]
      ? [tableMatch[2]]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);
    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(`${rows}x${columns} Table`, {
            icon: <i className="icon table" />,
            keywords: ["table"],
            onSelect: () =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
          }),
      ),
    );
  }

  return options;
}

type ShowModal = ReturnType<typeof useModal>[1];

function getBaseOptions(editor: LexicalEditor, showModal: ShowModal) {
  return [
    new ComponentPickerOption("Paragraph", {
      icon: <span className="icon-[tabler--mist] size-5"></span>,
      keywords: ["normal", "paragraph", "p", "text"],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        }),
    }),
    ...([1, 2, 3] as const).map(
      (n) =>
        new ComponentPickerOption(`Heading ${n}`, {
          icon: <span className={`icon-[tabler--h-${n}] size-5`}></span>,
          keywords: ["heading", "header", `h${n}`],
          onSelect: () =>
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
              }
            }),
        }),
    ),
    new ComponentPickerOption("Table", {
      icon: <span className="icon-[tabler--table] size-5"></span>,
      keywords: ["table", "grid", "spreadsheet", "rows", "columns"],
      onSelect: () =>
        showModal("Insert Table", (onClose) => (
          <InsertTableDialog activeEditor={editor} onClose={onClose} />
        )),
    }),
    new ComponentPickerOption("Numbered List", {
      icon: <span className="icon-[tabler--list-numbers] size-5"></span>,
      keywords: ["numbered list", "ordered list", "ol"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption("Bulleted List", {
      icon: <span className="icon-[tabler--list] size-5"></span>,
      keywords: ["bulleted list", "unordered list", "ul"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption("Check List", {
      icon: <span className="icon-[tabler--list-check] size-5"></span>,
      keywords: ["check list", "todo list"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption("Quote", {
      icon: <span className="icon-[tabler--quote-filled] size-5"></span>,
      keywords: ["block quote"],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }),
    }),
    new ComponentPickerOption("Code", {
      icon: <span className="icon-[tabler--code] size-5"></span>,
      keywords: ["javascript", "python", "js", "codeblock"],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              // Will this ever happen?
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection.insertRawText(textContent);
            }
          }
        }),
    }),
    new ComponentPickerOption("Divider", {
      icon: (
        <span className="icon-[tabler--square-toggle-horizontal] size-5"></span>
      ),
      keywords: ["horizontal rule", "divider", "hr"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),
    new ComponentPickerOption("Page Break", {
      icon: <span className="icon-[tabler--scissors] size-5"></span>,
      keywords: ["page break", "divider"],
      onSelect: () => editor.dispatchCommand(INSERT_PAGE_BREAK, undefined),
    }),
    new ComponentPickerOption("Excalidraw", {
      icon: <span className="icon-[tabler--sitemap] size-5"></span>,
      keywords: ["excalidraw", "diagram", "drawing"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined),
    }),
    new ComponentPickerOption("Poll", {
      icon: <span className="icon-[tabler--chart-bar]"></span>,
      keywords: ["poll", "vote"],
      onSelect: () =>
        showModal("Insert Poll", (onClose) => (
          <InsertPollDialog activeEditor={editor} onClose={onClose} />
        )),
    }),
    ...EmbedConfigs.map(
      (embedConfig) =>
        new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
          icon: embedConfig.icon,
          keywords: [...embedConfig.keywords, "embed"],
          onSelect: () =>
            editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
        }),
    ),
    new ComponentPickerOption("Date", {
      icon: <span className="icon-[tabler--calendar-week] size-5"></span>,
      keywords: ["date", "calendar", "time"],
      onSelect: () => {
        const dateTime = new Date();
        dateTime.setHours(0, 0, 0, 0); // Set time to midnight
        editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime });
      },
    }),
    new ComponentPickerOption("Today", {
      icon: <span className="icon-[tabler--calendar-dot] size-5"></span>,
      keywords: ["date", "calendar", "time", "today"],
      onSelect: () => {
        const dateTime = new Date();
        dateTime.setHours(0, 0, 0, 0); // Set time to midnight
        editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime });
      },
    }),
    new ComponentPickerOption("Tomorrow", {
      icon: <span className="icon-[tabler--calendar-up] size-5"></span>,
      keywords: ["date", "calendar", "time", "tomorrow"],
      onSelect: () => {
        const dateTime = new Date();
        dateTime.setDate(dateTime.getDate() + 1);
        dateTime.setHours(0, 0, 0, 0); // Set time to midnight
        editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime });
      },
    }),
    new ComponentPickerOption("Yesterday", {
      icon: <span className="icon-[tabler--calendar-down] size-5"></span>,
      keywords: ["date", "calendar", "time", "yesterday"],
      onSelect: () => {
        const dateTime = new Date();
        dateTime.setDate(dateTime.getDate() - 1);
        dateTime.setHours(0, 0, 0, 0); // Set time to midnight
        editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime });
      },
    }),
    new ComponentPickerOption("Equation", {
      icon: <span className="icon-[tabler--plus-equal] size-5"></span>,
      keywords: ["equation", "latex", "math"],
      onSelect: () =>
        showModal("Insert Equation", (onClose) => (
          <InsertEquationDialog activeEditor={editor} onClose={onClose} />
        )),
    }),
    new ComponentPickerOption("GIF", {
      icon: <span className="icon-[tabler--gif] size-5"></span>,
      keywords: ["gif", "animate", "image", "file"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          altText: "Cat typing on a laptop",
          src: catTypingGif,
        }),
    }),
    new ComponentPickerOption("Image", {
      icon: <span className="icon-[tabler--photo] size-5"></span>,
      keywords: ["image", "photo", "picture", "file"],
      onSelect: () =>
        showModal("Insert Image", (onClose) => (
          <InsertImageDialog activeEditor={editor} onClose={onClose} />
        )),
    }),
    new ComponentPickerOption("Collapsible", {
      icon: <span className="icon-[tabler--caret-right-filled] size-5"></span>,
      keywords: ["collapse", "collapsible", "toggle"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined),
    }),
    new ComponentPickerOption("Columns Layout", {
      icon: <span className="icon-[tabler--columns-3] size-5"></span>,
      keywords: ["columns", "layout", "grid"],
      onSelect: () =>
        showModal("Insert Columns Layout", (onClose) => (
          <InsertLayoutDialog activeEditor={editor} onClose={onClose} />
        )),
    }),
    ...(["left", "center", "right", "justify"] as const).map(
      (alignment) =>
        new ComponentPickerOption(`Align ${alignment}`, {
          icon: <span className={`icon-[tabler--align-${alignment}]`}></span>,
          keywords: ["align", "justify", alignment],
          onSelect: () =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
        }),
    ),
  ];
}

export default function ComponentPickerMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [modal, showModal] = useModal();
  const [queryString, setQueryString] = useState<string | null>(null);
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    allowWhitespace: true,
    minLength: 0,
  });
  const options = useMemo(() => {
    const baseOptions = getBaseOptions(editor, showModal);

    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, "i");

    return [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword) => regex.test(keyword)),
      ),
    ];
  }, [editor, queryString, showModal]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <>
      {modal}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
        ) =>
          anchorElementRef.current && options.length
            ? ReactDOM.createPortal(
                <div className="_typeahead-popover dialog relative w-52  max-h-52 overflow-y-scroll">
                  <ul className="menu">
                    {options.map((option, i: number) => (
                      <ComponentPickerMenuItem
                        index={i}
                        isSelected={selectedIndex === i}
                        onClick={() => {
                          setHighlightedIndex(i);
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={() => {
                          setHighlightedIndex(i);
                        }}
                        key={option.key}
                        option={option}
                      />
                    ))}
                  </ul>
                </div>,
                anchorElementRef.current,
              )
            : null
        }
      />
    </>
  );
}
