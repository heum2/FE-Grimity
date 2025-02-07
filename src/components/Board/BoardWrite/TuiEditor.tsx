import { useEffect, useRef } from "react";
import ToastuiEditor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

interface EditorOptions {
  el: HTMLElement;
  initialValue?: string;
  initialEditType?: "markdown" | "wysiwyg";
  previewStyle?: "vertical" | "tab";
  height?: string;
  usageStatistics?: boolean;
  events?: Record<string, Function>;
}

interface EventMap {
  load: () => void;
  change: () => void;
  caretChange: () => void;
  focus: () => void;
  blur: () => void;
  keydown: (event: KeyboardEvent) => void;
  keyup: (event: KeyboardEvent) => void;
  beforePreviewRender: (html: string) => string;
  beforeConvertWysiwygToMarkdown: (markdown: string) => string;
}

export interface EventMapping {
  onLoad: EventMap["load"];
  onChange: EventMap["change"];
  onCaretChange: EventMap["caretChange"];
  onFocus: EventMap["focus"];
  onBlur: EventMap["blur"];
  onKeydown: EventMap["keydown"];
  onKeyup: EventMap["keyup"];
  onBeforePreviewRender: EventMap["beforePreviewRender"];
  onBeforeConvertWysiwygToMarkdown: EventMap["beforeConvertWysiwygToMarkdown"];
}

export type EventNames = keyof EventMapping;

export type TuiEditorProps = Omit<EditorOptions, "el"> & Partial<EventMapping>;

export default function TuiEditor(props: TuiEditorProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ToastuiEditor | null>(null);

  useEffect(() => {
    if (divRef.current) {
      editorRef.current = new ToastuiEditor({
        ...props,
        el: divRef.current,
        usageStatistics: false,
        events: getInitEvents(props),
      });
    }
  }, []);

  useEffect(() => {
    if (props.height) {
      editorRef.current?.setHeight(props.height);
    }

    if (props.previewStyle) {
      editorRef.current?.changePreviewStyle(props.previewStyle);
    }

    if (editorRef.current) {
      bindEventHandlers(editorRef.current, props);
    }
  }, [props]);

  return <div ref={divRef}></div>;
}

function getBindingEventNames(props: TuiEditorProps) {
  return Object.keys(props)
    .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key))
    .filter((key) => props[key as EventNames]);
}

function bindEventHandlers(editor: ToastuiEditor, props: TuiEditorProps) {
  getBindingEventNames(props).forEach((key) => {
    const eventName = (key[2].toLowerCase() + key.slice(3)) as string;

    editor.off(eventName);
    editor.on(eventName, props[key as EventNames]!);
  });
}

function getInitEvents(props: TuiEditorProps) {
  return getBindingEventNames(props).reduce(
    (acc: Record<string, EventMap[keyof EventMap]>, key) => {
      const eventName = (key[2].toLowerCase() + key.slice(3)) as keyof EventMap;

      const handler = props[key as EventNames];
      if (handler) {
        acc[eventName] = handler;
      }

      return acc;
    },
    {}
  );
}
