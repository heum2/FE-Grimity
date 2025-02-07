declare module "@toast-ui/editor" {
  import { Editor } from "@toast-ui/editor";

  export default Editor;
}

declare module "@toast-ui/react-editor" {
  import { Component, RefObject } from "react";

  export interface EditorProps {
    initialValue?: string;
    previewStyle?: "vertical" | "tab";
    height?: string;
    initialEditType?: "markdown" | "wysiwyg";
    useCommandShortcut?: boolean;
    hooks?: {
      addImageBlobHook?: (file: Blob, callback: (url: string, alt: string) => void) => void;
    };
    toolbarItems?: Array<Array<string>>;
    plugins?: Array<(context: any, options?: any) => any>;
    language?: string;
  }

  export class Editor extends Component<EditorProps> {
    getInstance(): {
      getMarkdown(): string;
      getHTML(): string;
    };
  }
}
