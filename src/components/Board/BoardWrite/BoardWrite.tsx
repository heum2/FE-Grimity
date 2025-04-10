import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import Button from "@/components/Button/Button";
import styles from "./BoardWrite.module.scss";
import { postPresignedUrl } from "@/api/aws/postPresigned";
import TextField from "@/components/TextField/TextField";
import { useMutation } from "react-query";
import { CreatePostRequest, PostsResponse, postPosts } from "@/api/posts/postPosts";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/useToast";
import Loader from "@/components/Layout/Loader/Loader";
import { useDeviceStore } from "@/states/deviceStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAuthStore } from "@/states/authStore";
import { imageUrl } from "@/constants/imageUrl";

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <Loader />,
});

export default function BoardWrite() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);
  useIsMobile();
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

  useEffect(() => {
    if (!isLoggedIn) {
      showToast("로그인 후 작성 가능합니다.", "warning");
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  const { mutate: createPost } = useMutation<PostsResponse, AxiosError, CreatePostRequest>(
    postPosts,
    {
      onSuccess: (response) => {
        router.push(`/posts/${response.id}`);
        showToast("글이 등록되었어요.", "success");
      },
      onError: () => {
        showToast("글 작성에 실패했습니다.", "error");
      },
    },
  );

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

  const convertToWebP = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context not available"));

        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
              type: "image/webp",
            });
            resolve(webpFile);
          } else {
            reject(new Error("Failed to convert image to WebP"));
          }
        }, "image/webp");
      };
      img.onerror = () => reject(new Error("Image loading failed"));
    });
  };

  return (
    <div className={styles.container}>
      <Script
        src="https://public.grimity.com/tinymce/tinymce.min.js"
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
                images_upload_handler: async (
                  blobInfo: { filename: () => string; blob: () => Blob },
                  progress: (progress: number) => void,
                ): Promise<string> => {
                  try {
                    const file = blobInfo.blob() as File;

                    const ext = file.name.split(".").pop()?.toLowerCase() as "jpg" | "jpeg" | "png";
                    const webpFile = await convertToWebP(file);

                    const data = await postPresignedUrl({
                      type: "post",
                      ext: "webp",
                    });

                    const uploadResponse = await fetch(data.url, {
                      method: "PUT",
                      body: webpFile,
                      headers: {
                        "Content-Type": "image/webp",
                      },
                    });

                    if (!uploadResponse.ok) {
                      throw new Error(`${uploadResponse.status}`);
                    }

                    return `${imageUrl}/${data.imageName}`;
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
