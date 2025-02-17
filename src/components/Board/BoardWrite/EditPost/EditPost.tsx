import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import Button from "@/components/Button/Button";
import styles from "./EditPost.module.scss";
import { postPresignedUrl } from "@/api/aws/postPresigned";
import TextField from "@/components/TextField/TextField";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/useToast";
import Loader from "@/components/Layout/Loader/Loader";
import { EditPostsRequest, putEditPosts } from "@/api/posts/putPostsId";
import { EditPostProps } from "./EditPost.types";
import { usePostsDetails } from "@/api/posts/getPostsId";
import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";
import { useRecoilValue } from "recoil";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <Loader />,
});

export default function EditPost({ id }: EditPostProps) {
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  useIsMobile();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("일반");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { showToast } = useToast();
  const [, setModal] = useRecoilState(modalState);
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const editorRef = useRef<any>(null);
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  const { data: posts, isLoading } = usePostsDetails(id as string);

  const typeMap = {
    NORMAL: "일반",
    QUESTION: "질문",
    FEEDBACK: "피드백",
  } as const;

  useEffect(() => {
    if (window.tinymce) {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (posts) {
      setTitle(posts.title);
      setContent(posts.content);
      setSelectedCategory(typeMap[posts.type as keyof typeof typeMap] || "일반");
    }
  }, [posts]);

  // 변경 사항 감지
  useEffect(() => {
    const hasChanges =
      title !== posts?.title || content !== posts?.content || selectedCategory !== posts?.type;
    setHasUnsavedChanges(hasChanges);
  }, [posts, title, content, selectedCategory]);

  // 브라우저 이벤트 핸들러
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message = "변경사항이 저장되지 않을 수 있습니다.";
        e.preventDefault();
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 라우터 이벤트 핸들러
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (!hasUnsavedChangesRef.current) return;

      router.events.emit("routeChangeError");

      setModal({
        isOpen: true,
        type: null,
        data: {
          title: "수정을 취소하고 나가시겠어요?",
          subtitle: "변경사항이 저장되지 않습니다",
          confirmBtn: "나가기",
          onClick: () => {
            hasUnsavedChangesRef.current = false;
            setHasUnsavedChanges(false);
            router.push(url);
          },
        },
        isComfirm: true,
      });

      throw "routeChange aborted.";
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router, setModal]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  const { mutate: editPost } = useMutation((data: EditPostsRequest) => putEditPosts(id, data), {
    onSuccess: () => {
      hasUnsavedChangesRef.current = false;
      router.push(`/posts/${id}`);
      showToast("수정이 완료되었습니다!", "success");
    },
    onError: (error: AxiosError) => {
      showToast("수정 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
      if (error.response?.status === 400) {
        showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
      }
    },
  });

  const handleSubmit = () => {
    if (content.length > 1000) {
      showToast("내용은 최대 1000자까지 입력 가능합니다.", "warning");
      return;
    }

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

    editPost({
      title,
      content,
      type: typeMap[selectedCategory as keyof typeof typeMap],
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Script
        src="/tinymce/tinymce.min.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      <div className={styles.center}>
        <section className={styles.header}>
          <h2 className={styles.title}>글 수정하기</h2>
          <Button
            size="m"
            type="filled-primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            수정 완료
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
                `,
                base_url: "/tinymce",
                skin_url: "/tinymce/skins/ui/oxide",
                icons_url: "/tinymce/icons/default/icons.js",
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
                  progress: (progress: number) => void
                ): Promise<string> => {
                  try {
                    const file = blobInfo.blob() as File;
                    const ext = file.name.split(".").pop() as "jpg" | "jpeg" | "png" | "gif";
                    const data = await postPresignedUrl({
                      type: "post",
                      ext,
                    });

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
