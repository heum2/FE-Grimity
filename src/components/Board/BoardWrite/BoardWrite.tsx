import React, { useState, useMemo, useRef, useEffect } from "react";
import Button from "@/components/Button/Button";
import styles from "./BoardWrite.module.scss";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.core.css";
import "react-quill-new/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import QuillImageDropAndPaste, { type ImageData } from "quill-image-drop-and-paste";
import { postPresignedUrl, PresignedUrlResponse } from "@/api/aws/postPresigned";
import TextField from "@/components/TextField/TextField";
import MagicUrl from "quill-magic-url";
const Parchment = Quill.import("parchment");
const Block = Quill.import("blots/block/embed") as any;

declare namespace Parchment {
  interface Blot {
    offset(scroll: any): number;
  }
}

class DraggableImage extends Block {
  static create(value: any) {
    const node = super.create(value);
    node.setAttribute("src", value);
    node.style.cursor = "move"; // 드래그 시 마우스 커서 변경
    return node;
  }
  static value(node: any) {
    return node.getAttribute("src");
  }
}
DraggableImage.blotName = "draggable-image";
DraggableImage.tagName = "img";
DraggableImage.className = "draggable-img";
Quill.register(DraggableImage);
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);
Quill.register("modules/magicUrl", MagicUrl);

export async function uploadImage(file: File) {
  const ext = file.name.split(".").pop() as "jpg" | "jpeg" | "png" | "gif";

  const { url, imageName }: PresignedUrlResponse = await postPresignedUrl({
    type: "post",
    ext,
  });

  await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return imageName;
}

export default function BoardWrite() {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("일반");
  const [content, setContent] = useState("");
  const quillRef = useRef<ReactQuill>(null);
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const root = editor.root;
      let draggedImageSrc: string | null = null;
      let draggedImageIndex: number | null = null;

      root.parentNode!.addEventListener(
        "dragstart",
        (evt) => {
          evt.stopPropagation(); // Quill 내부 이벤트 전파 방지
          const target = evt.target as HTMLImageElement;
          if (target.classList.contains("draggable-img")) {
            draggedImageSrc = target.src;
            // 이미지의 현재 위치 찾기
            const blot = Quill.find(target) as Parchment.Blot | null;
            if (blot) {
              draggedImageIndex = blot.offset(editor.scroll);
            }
          }
        },
        true // Capture phase에서 실행
      );
      root.addEventListener("dragover", (e) => {
        e.preventDefault();
        const selection = document.caretPositionFromPoint
          ? document.caretPositionFromPoint(e.clientX, e.clientY) // Chromium
          : (document as any).caretRangeFromPoint(e.clientX, e.clientY); // Firefox
        if (selection) {
          const blot = Quill.find(selection.offsetNode) as Parchment.Blot | null;
          if (blot) {
            const index = blot.offset(editor.scroll) + selection.offset; // Blot 위치 기반으로 index 계산
            editor.setSelection(index, 0); // 커서 이동
          }
        }
      });
      root.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedImageSrc !== null && draggedImageIndex !== null) {
          const range = editor.getSelection();
          if (range) {
            // Blot을 찾아서 직접 삭제
            const [blot] = editor.scroll.descendant(
              Quill.import("blots/block/embed") as any,
              draggedImageIndex
            );
            if (blot) {
              console.log("deleteAt", blot);
              blot.deleteAt(0, 1);
            }
            // 새 위치에 이미지 삽입
            editor.insertEmbed(range.index, "draggable-image", draggedImageSrc);
            editor.setSelection(range.index + 1);
          }
          draggedImageSrc = null;
          draggedImageIndex = null;
        }
      });
    }
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = () => {
    console.log("Title:", title);
    console.log("Category:", selectedCategory);
    console.log("Content:", content);
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const imageName = await uploadImage(file);
        const editor = quillRef.current!.getEditor();
        const range = editor.getSelection()!;
        editor.insertEmbed(
          range.index,
          "draggable-image",
          `https://image.grimity.com/${imageName}`
        );
        editor.setSelection(range.index + 1);
      }
    };
    input.click();
  };

  async function imageDropAndPasteHandler(
    imageDataUrl: string | ArrayBuffer,
    type: string,
    imageData: ImageData
  ) {
    const file = imageData.toFile();
    if (!file) {
      return;
    }

    const imageName = await uploadImage(file);
    const editor = quillRef.current!.getEditor();
    const range = editor.getSelection()!;
    editor.insertEmbed(range.index, "draggable-image", `https://image.grimity.com/${imageName}`);
    editor.setSelection(range.index + 1);
  }

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", { color: [] }],
          ["link", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageDropAndPaste: {
        handler: imageDropAndPasteHandler,
      },
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true,
      },
      magicUrl: {
        normalizeUrlOptions: {
          stripHash: true,
          stripWWW: false,
          normalizeProtocol: false,
        },
      },
    };
  }, []);

  const formats = ["header", "bold", "italic", "underline", "strike", "color", "link", "image"];

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <section className={styles.header}>
          <h2 className={styles.title}>글쓰기</h2>
          <Button size="m" type="filled-primary" onClick={handleSubmit}>
            작성 완료
          </Button>
        </section>
        <section className={styles.categorys}>
          {["일반", "질문", "피드백"].map((category) => (
            <Button
              key={category}
              size="s"
              type={selectedCategory === category ? "filled-primary" : "outlined-assistive"}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </section>
        <TextField
          placeholder="제목을 입력해주세요"
          maxLength={32}
          value={title}
          onChange={handleTitleChange}
        />
        <section className={styles.editor}>
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={content}
            onChange={handleEditorChange}
            ref={quillRef}
            style={{
              height: "100%",
            }}
          />
        </section>
      </div>
    </div>
  );
}
