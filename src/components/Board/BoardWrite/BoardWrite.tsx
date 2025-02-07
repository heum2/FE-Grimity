import React, { useRef, useState } from "react";
import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";
import styles from "./BoardWrite.module.scss";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { postPresignedUrl, PresignedUrlResponse } from "@/api/aws/postPresigned";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "@toast-ui/editor/dist/i18n/ko-kr";

export async function uploadImage(file: File): Promise<string> {
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

  return `https://image.grimity.com/${imageName}`;
}

export default function BoardWrite() {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("일반");
  const editorRef = useRef<Editor>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    if (!editorRef.current) return;

    const content = editorRef.current.getInstance().getHTML();
    console.log("Title:", title);
    console.log("Category:", selectedCategory);
    console.log("Content:", content);
  };

  const onUploadImage = async (file: Blob, callback: (url: string, alt: string) => void) => {
    if (file instanceof File) {
      try {
        const imageUrl = await uploadImage(file);
        callback(imageUrl, file.name);
        return false;
      } catch (error) {
        console.error("Image upload failed:", error);
        return false;
      }
    } else {
      console.error("Provided blob is not a File.");
      return false;
    }
  };

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
          <Editor
            ref={editorRef}
            initialValue=""
            previewStyle="vertical"
            height="600px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            hooks={{
              addImageBlobHook: onUploadImage,
            }}
            toolbarItems={[
              ["heading", "bold", "italic", "strike"],
              ["ul", "ol"],
              ["image", "link"],
            ]}
            plugins={[colorSyntax]}
            language="ko-KR"
          />
        </section>
      </div>
    </div>
  );
}
