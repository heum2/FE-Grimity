import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import Button from "@/components/Button/Button";
import styles from "./BoardWrite.module.scss";
import { postPresignedUrl } from "@/api/aws/postPresigned";
import TextField from "@/components/TextField/TextField";
import { useMutation } from "react-query";
import { PostsRequest, PostsResponse, postPosts } from "@/api/posts/postPosts";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useToast } from "@/utils/useToast";
import Loader from "@/components/Layout/Loader/Loader";

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <Loader />,
});

export default function BoardWrite() {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("일반");
  const [content, setContent] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (window.tinymce) {
      setIsScriptLoaded(true);
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

  const { mutate: createPost } = useMutation<PostsResponse, AxiosError, PostsRequest>(postPosts, {
    onSuccess: (response) => {
      showToast("글이 등록되었어요.", "success");
      router.push(`/posts/${response.id}`);
    },
    onError: () => {
      showToast("글 작성에 실패했습니다.", "error");
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast("제목을 입력해주세요.", "error");
      return;
    }

    if (!content.trim()) {
      showToast("내용을 입력해주세요.", "error");
      return;
    }

    const typeMap = {
      일반: "NORMAL",
      질문: "QUESTION",
      피드백: "FEEDBACK",
    } as const;

    createPost({
      title,
      content,
      type: typeMap[selectedCategory as keyof typeof typeMap],
    });
  };

  return (
    <div className={styles.container}>
      <Script
        src="/tinymce/tinymce.min.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      <div className={styles.center}>
        <section className={styles.header}>
          <h2 className={styles.title}>글쓰기</h2>
          <Button
            size="m"
            type="filled-primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
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
          {isScriptLoaded ? (
            <Editor
              licenseKey="gpl"
              onInit={(evt, editor) => (editorRef.current = editor)}
              init={{
                height: 600,
                menubar: false,
                plugins: ["image", "link", "autolink"],
                toolbar:
                  "undo redo | h1 h2 | bold italic underline strikethrough | forecolor backcolor | link image",
                content_style: "body { font-family: Pretendard, sans-serif; font-size: 14px; }",
                base_url: "/tinymce",
                skin_url: "/tinymce/skins/ui/oxide",
                icons_url: "/tinymce/icons/default/icons.js",
                statusbar: false,
                images_upload_handler: async (
                  blobInfo: { filename: () => string; blob: () => Blob },
                  progress: (progress: number) => void
                ): Promise<string> => {
                  try {
                    const file = blobInfo.blob() as File;
                    const maxWidth = 800;
                    const maxHeight = 600;

                    const resizeImage = (file: File, maxWidth: number, maxHeight: number) =>
                      new Promise<File>((resolve) => {
                        const img = document.createElement("img");
                        const reader = new FileReader();

                        reader.onload = (e) => {
                          img.src = e.target?.result as string;
                          img.onload = () => {
                            const canvas = document.createElement("canvas");
                            const ctx = canvas.getContext("2d")!;
                            let width = img.width;
                            let height = img.height;

                            if (width > maxWidth || height > maxHeight) {
                              if (width > height) {
                                height *= maxWidth / width;
                                width = maxWidth;
                              } else {
                                width *= maxHeight / height;
                                height = maxHeight;
                              }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);

                            canvas.toBlob((blob) => {
                              resolve(new File([blob!], file.name, { type: file.type }));
                            }, file.type);
                          };
                        };

                        reader.readAsDataURL(file);
                      });

                    const resizedFile = await resizeImage(file, maxWidth, maxHeight);

                    const ext = resizedFile.name.split(".").pop() as "jpg" | "jpeg" | "png" | "gif";
                    const data = await postPresignedUrl({
                      type: "post",
                      ext,
                    });

                    const uploadResponse = await fetch(data.url, {
                      method: "PUT",
                      body: resizedFile,
                      headers: {
                        "Content-Type": resizedFile.type,
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
              value={content}
              onEditorChange={handleEditorChange}
            />
          ) : (
            <Loader />
          )}
        </section>
      </div>
    </div>
  );
}
