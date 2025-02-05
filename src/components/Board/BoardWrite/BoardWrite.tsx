import React, { useState } from "react";
import Button from "@/components/Button/Button";
import styles from "./BoardWrite.module.scss";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import { useMemo, useRef } from "react";
import QuillImageDropAndPaste, { type ImageData } from "quill-image-drop-and-paste";
import { postPresignedUrl, PresignedUrlResponse } from "@/api/aws/postPresigned";
import MagicUrl from "quill-magic-url";
import TextField from "@/components/TextField/TextField";

Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);
Quill.register("modules/imageResize", ImageResize);
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

  const quillRef = useRef<ReactQuill>(null);

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
        editor.insertEmbed(range.index, "image", `https://image.grimity.com/${imageName}`);
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
    editor.insertEmbed(range.index, "image", `https://image.grimity.com/${imageName}`);
    editor.setSelection(range.index + 1);
  }

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
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
        handleStyles: {
          backgroundColor: "transparent",
          border: "none",
        },
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
