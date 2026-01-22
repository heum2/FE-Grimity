import React, { useState } from "react";
import { useRouter } from "next/router";

import { useMutation } from "@tanstack/react-query";

import { postPosts } from "@/api/posts/postPosts";

import PostForm from "@/components/Board/BoardWrite/PostForm/PostForm";

import { useToast } from "@/hooks/useToast";
import { event as gtagEvent } from "@/constants/gtag";

export default function BoardWrite() {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("일반");
  const [content, setContent] = useState("");
  const { showToast } = useToast();
  const router = useRouter();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  const { mutateAsync: createPost, isPending: isCreatePostLoading } = useMutation({
    mutationFn: postPosts,
  });

  const handleReset = () => {
    setTitle("");
    setContent("");
    setSelectedCategory("일반");
  };

  const handleSubmit = async () => {
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

    try {
      const response = await createPost({
        title,
        content,
        type: typeMap[selectedCategory as keyof typeof typeMap],
      });

      // GA 게시글 업로드 완료 이벤트 추적
      gtagEvent({
        action: "upload_post",
        category: "conversion",
        label: `${selectedCategory}: ${title}`,
      });

      showToast("글이 등록되었어요.", "success");
      handleReset();

      router.push(`/posts/${response.id}`);
    } catch (error) {
      showToast("글 작성에 실패했습니다.", "error");
    }
  };

  return (
    <PostForm
      formTitle="글쓰기"
      title={title}
      onTitleChange={handleTitleChange}
      content={content}
      onEditorChange={handleEditorChange}
      selectedCategory={selectedCategory}
      onCategoryClick={handleCategoryClick}
      onSubmit={handleSubmit}
      isSubmitting={isCreatePostLoading}
      submitButtonText="작성 완료"
    />
  );
}
