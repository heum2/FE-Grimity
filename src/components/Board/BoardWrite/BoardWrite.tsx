import React, { useState } from "react";
import Button from "@/components/Button/Button";
import styles from "./BoardWrite.module.scss";
import { Editor } from "@tinymce/tinymce-react";
import { postPresignedUrl, PresignedUrlResponse } from "@/api/aws/postPresigned";
import TextField from "@/components/TextField/TextField";

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
            apiKey="j0wfnd24aqsdpnucudy7qwpadldqmovdyc9wqh1jscm0a9vq"
            value={content}
            init={{
              height: 600,
              menubar: false,
              plugins: ["image", "link", "textcolor"],
              toolbar: "undo redo | bold italic underline | link image | forecolor backcolor",
              content_style: "body {font-family: Pretendard, sans-serif; font-size: 14px; }",
              fontsize_formats: "11px 12px 14px ...",
              image_uploadtab: true,
              statusbar: false,
              images_upload_handler: async (blobInfo: any) => {
                try {
                  const file = blobInfo.blob() as File;
                  const ext = file.name.split(".").pop() as "jpg" | "jpeg" | "png" | "gif";

                  const data = await postPresignedUrl({
                    type: "post",
                    ext,
                  });

                  const formData = new FormData();
                  formData.append("file", file);

                  const uploadResponse = await fetch(data.url, {
                    method: "PUT",
                    body: file,
                    headers: {
                      "Content-Type": file.type,
                    },
                  });

                  if (!uploadResponse.ok) {
                    throw new Error(`${uploadResponse.status}`);
                  }

                  return `https://image.grimity.com/${data.imageName}`;
                } catch (error) {
                  return Promise.reject("이미지 업로드 실패");
                }
              },
            }}
            onEditorChange={handleEditorChange}
          />
        </section>
      </div>
    </div>
  );
}
