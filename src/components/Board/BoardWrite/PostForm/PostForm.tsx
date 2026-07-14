import React, { useRef, useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Editor as TinyMCEEditor } from "tinymce";

import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import TextField from "@/components/common/Input/TextField/TextField";
import Filter from "@/components/common/Filter/Filter";
import Loader from "@/components/Layout/Loader/Loader";

import { useDeviceStore } from "@/states/deviceStore";
import { useEditorImageUploader } from "@/hooks/useEditorImageUploader";

import type { PostFormProps } from "./PostForm.types";
import styles from "./PostForm.module.scss";

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <Loader />,
});

const TITLE_MAX_LENGTH = 32;
const CONTENT_MAX_LENGTH = 500;
const HTML_TAG_REGEX = /<[^>]*>/g;

const CATEGORY_OPTIONS = [
  { label: "일반", value: "일반" },
  { label: "질문", value: "질문" },
  { label: "피드백", value: "피드백" },
];

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
  const { isMobile, isTablet } = useDeviceStore();

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { uploadImage } = useEditorImageUploader();

  const contentLength = useMemo(() => content.replace(HTML_TAG_REGEX, "").length, [content]);

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
        <section className={styles.formSection}>
          <div className={styles.fieldsGroup}>
          <div className={styles.searchRow}>
            <Filter
              options={CATEGORY_OPTIONS}
              value={selectedCategory}
              onChange={onCategoryClick}
              align="left"
              className={styles.categoryFilter}
            />
            <TextField
              variant="count"
              size="sm"
              placeholder="제목을 입력해주세요"
              maxCount={TITLE_MAX_LENGTH}
              value={title}
              onChange={onTitleChange}
              className={styles.titleField}
            />
          </div>
          <div className={styles.editorWrapper}>
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
                  relative_urls: false,
                  remove_script_host: false,
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
          </div>
          <div className={styles.charCount}>
            <span className={styles.charCountCurrent}>{contentLength}</span>
            <span className={styles.charCountMax}>/{CONTENT_MAX_LENGTH}</span>
          </div>
          </div>
          <div className={styles.buttonContainer}>
            <SolidButton
              className={styles.button}
              size="large"
              onClick={onSubmit}
              disabled={disabled}
              loading={isSubmitting}
            >
              {submitButtonText}
            </SolidButton>
          </div>
        </section>
      </div>
    </div>
  );
}
