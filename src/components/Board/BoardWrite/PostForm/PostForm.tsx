import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Editor as TinyMCEEditor } from "tinymce";

import { useDeviceStore } from "@/states/deviceStore";

import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";
import Loader from "@/components/Layout/Loader/Loader";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useEditorImageUploader } from "@/hooks/useEditorImageUploader";

import type { PostFormProps } from "./PostForm.types";
import styles from "./PostForm.module.scss";

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <Loader />,
});

export default function PostForm({
  formTitle,
  title,
  onTitleChange,
  content,
  onEditorChange,
  selectedCategory,
  onCategoryClick,
  onSubmit,
  isSubmitting,
  submitButtonText,
}: PostFormProps) {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);
  useIsMobile();

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { uploadImage } = useEditorImageUploader();

  useEffect(() => {
    if (window.tinymce) {
      setIsScriptLoaded(true);
    }
  }, []);

  const disabled = !title.trim() || !content.trim() || isSubmitting;

  return (
    <div className={styles.container}>
      <Script
        src="https://public.grimity.com/tinymce/tinymce.min.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      <div className={styles.center}>
        <section className={styles.header}>
          <h2 className={styles.title}>{formTitle}</h2>
        </section>
        <section className={styles.categorys}>
          {["일반", "질문", "피드백"].map((category) => (
            <Button
              key={category}
              size="s"
              type={selectedCategory === category ? "filled-primary" : "outlined-assistive"}
              onClick={() => onCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </section>
        <TextField
          placeholder="제목을 입력해주세요"
          maxLength={32}
          value={title}
          onChange={onTitleChange}
        />
        <section className={styles.editor}>
          {isScriptLoaded ? (
            <Editor
              licenseKey="gpl"
              onInit={(evt, editor) => (editorRef.current = editor)}
              init={{
                height: isMobile ? 500 : isTablet ? 700 : 600,
                resize: "both",
                menubar: false,
                plugins: ["image", "link", "autolink"],
                toolbar: isMobile
                  ? "undo redo | h1 h2 link image | bold italic underline strikethrough | forecolor backcolor"
                  : "undo redo | h1 h2 | bold italic underline strikethrough | forecolor backcolor | link image",
                content_style: `
                  body { 
                    font-family: Pretendard, sans-serif; 
                    font-size: 14px;                     
                  }
                  img { 
                    max-width: 100%; 
                    height: auto !important;
                  }
                  h1 {
                    margin: 14px 0;
                  }
                  h2 {
                    margin: 14px 0;
                  }
                  p {
                    margin: 6px 0;
                  }
                `,
                base_url: "https://public.grimity.com/tinymce",
                skin_url: "https://public.grimity.com/tinymce/skins/ui/oxide",
                icons_url: "https://public.grimity.com/tinymce/icons/default/icons.js",
                statusbar: false,
                indent: false,
                indent_use_margin: true,
                indent_size: 4,
                setup: (editor) => {
                  editor.on("keydown", (event) => {
                    if (event.key === "Tab") {
                      event.preventDefault();
                      editor.execCommand("mceInsertContent", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
                    }
                  });
                },
                images_upload_handler: uploadImage,
              }}
              value={content}
              onEditorChange={onEditorChange}
            />
          ) : (
            <Loader />
          )}
          <div className={styles.buttonContainer}>
            <Button
              className={styles.button}
              type="filled-primary"
              onClick={onSubmit}
              disabled={disabled}
            >
              {submitButtonText}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
