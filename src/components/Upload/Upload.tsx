import { useCallback, useEffect, useState } from "react";
import Button from "../Button/Button";
import styles from "./Upload.module.scss";
import Image from "next/image";
import IconComponent from "../Asset/Icon";
import { useToast } from "@/utils/useToast";
import { postPresignedUrls } from "@/api/aws/postPresigned";
import router from "next/router";
import { useMutation } from "react-query";
import { FeedsRequest, FeedsResponse, postFeeds } from "@/api/feeds/postFeeds";
import { AxiosError } from "axios";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableImage from "./DraggableImage/DraggableImage";
import Chip from "../Chip/Chip";
import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";

export default function Upload() {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAI, setIsAI] = useState(false);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [, setModal] = useRecoilState(modalState);
  const { showToast } = useToast();

  // 첫 번째 사진을 썸네일 기본값으로
  useEffect(() => {
    if (images.length > 0) {
      setThumbnailUrl(images[0].url);
      setThumbnailName(images[0].name);
    } else {
      setThumbnailUrl("");
      setThumbnailName("");
    }
  }, [images]);

  // 변경 사항 감지
  useEffect(() => {
    const hasChanges =
      images.length > 0 || title.trim() !== "" || content.trim() !== "" || tags.length > 0;
    setHasUnsavedChanges(hasChanges);
  }, [images, title, content, tags]);

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
    const handleRouteChangeStart = (url: string) => {
      if (!hasUnsavedChanges) return;

      router.events.emit("routeChangeError");

      setModal({
        isOpen: true,
        type: null,
        data: {
          title: "업로드를 취소하고 나가시겠어요?",
          subtitle: "작성한 내용들은 모두 초기화돼요",
          confirmBtn: "나가기",
          onClick: () => {
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
  }, [hasUnsavedChanges, router, setModal]);

  const { mutate: uploadFeed } = useMutation<FeedsResponse, AxiosError, FeedsRequest>(postFeeds, {
    onSuccess: (response: FeedsResponse) => {
      setHasUnsavedChanges(false);
      showToast("그림이 업로드되었습니다!", "success");
      router.push(`/feeds/${response.id}`);
    },
    onError: (error: AxiosError) => {
      showToast("업로드 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
      if (error.response?.status === 400) {
        showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
      }
    },
  });

  const uploadImagesToServer = async (files: FileList) => {
    try {
      const remainingSlots = 10 - images.length;
      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      if (remainingSlots <= 0) {
        showToast("최대 10장의 그림만 업로드할 수 있습니다.", "error");
        return;
      }

      const requests = filesToUpload.map((file) => ({
        type: "feed" as const,
        ext: file.name.split(".").pop()?.toLowerCase() as "jpg" | "jpeg" | "png" | "gif",
      }));

      const invalidFiles = filesToUpload.some(
        (file) =>
          !["jpg", "jpeg", "png", "gif"].includes(file.name.split(".").pop()?.toLowerCase() || "")
      );

      if (invalidFiles) {
        showToast("JPG, PNG, GIF 파일만 업로드 가능합니다.", "error");
        return;
      }

      const presignedUrls = await postPresignedUrls(requests);

      const uploadPromises = filesToUpload.map((file, index) =>
        fetch(presignedUrls[index].url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })
      );

      await Promise.all(uploadPromises);

      const newImages = filesToUpload.map((file, index) => ({
        name: presignedUrls[index].imageName,
        url: URL.createObjectURL(file),
      }));

      setImages([...images, ...newImages]);
    } catch (error) {
      showToast("이미지 업로드를 실패했어요.", "error");
    }
  };

  const selectThumbnail = (url: string) => {
    setThumbnailUrl(url);
    const selectedImage = images.find((img) => img.url === url);
    if (selectedImage) {
      setThumbnailName(selectedImage.name);
    }
  };

  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, draggedImage);
      return newImages;
    });
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    setImages((prevImages) => {
      const newImages = [...prevImages];
      const draggedImage = newImages[sourceIndex];
      newImages.splice(sourceIndex, 1);
      newImages.splice(destinationIndex, 0, draggedImage);
      return newImages;
    });
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    await uploadImagesToServer(files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);

      // 첫 번째 이미지가 삭제되었을 경우 대표 이미지 변경
      if (index === 0 && updatedImages.length > 0) {
        setThumbnailUrl(updatedImages[0].url);
        setThumbnailName(updatedImages[0].name);
      } else if (updatedImages.length === 0) {
        setThumbnailUrl("");
        setThumbnailName("");
      }

      return updatedImages;
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast("제목을 입력해주세요.", "error");
      return;
    }

    if (images.length === 0) {
      showToast("최소 1장의 그림을 업로드해야 합니다.", "error");
      return;
    }

    setModal({
      isOpen: true,
      type: null,
      data: {
        title: "그림을 업로드할까요?",
        confirmBtn: "업로드",
        onClick: handleUpload,
      },
      isComfirm: true,
    });
  };

  const handleUpload = async () => {
    setModal({
      isOpen: false,
      type: null,
      data: null,
      isComfirm: false,
    });

    uploadFeed({
      title,
      cards: images.map((image) => image.name),
      isAI,
      content,
      tags,
      thumbnail: thumbnailName,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tag.trim() !== "") {
      event.preventDefault();

      if (tags.length >= 8) {
        showToast("태그는 최대 8개까지 추가할 수 있어요", "error");
        return;
      }

      if (tags.includes(tag.trim())) {
        showToast("이미 추가된 태그입니다.", "error");
        setTag("");
        return;
      }

      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const isDisabled = title.trim() === "" || isAI === null;

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.uploadBtnContainer}>
          <Button size="m" type="filled-primary" disabled={isDisabled} onClick={handleSubmit}>
            업로드
          </Button>
        </div>
        <div className={styles.sectionContainer}>
          <section className={styles.imageSection}>
            <div>
              <div>
                {images.length === 0 && (
                  <div onDrop={handleDrop} onDragOver={handleDragOver}>
                    <label htmlFor="file-upload" className={styles.uploadBtn}>
                      <Image src="/image/upload.svg" width={320} height={320} alt="그림 올리기" />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      hidden
                      onChange={(e) => uploadImagesToServer(e.target.files!)}
                    />
                  </div>
                )}
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="image-list">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.imageContainer}
                      >
                        {images.map((image, index) => (
                          <DraggableImage
                            key={image.name}
                            image={image}
                            index={index}
                            moveImage={moveImage}
                            removeImage={removeImage}
                            isThumbnail={thumbnailUrl === image.url}
                            onThumbnailSelect={() => selectThumbnail(image.url)}
                            imageCount={images.length}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                {images.length > 0 && images.length < 10 && (
                  <label htmlFor="file-upload" className={styles.addBtnContainer}>
                    <div
                      className={styles.addBtn}
                      tabIndex={0}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <Image
                        src="/icon/upload-add-image.svg"
                        width={20}
                        height={20}
                        alt="이미지 추가"
                      />
                      이미지 추가
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => uploadImagesToServer(e.target.files!)}
                      />
                    </div>
                  </label>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/gif"
                style={{ display: "none" }}
                onChange={(e) => e.target.files && uploadImagesToServer(e.target.files)}
              />
            </div>
          </section>
          <section className={styles.writeSection}>
            <div className={styles.textField}>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="제목을 입력해주세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={32}
                />
                {title && (
                  <p className={styles.countTotal}>
                    <p className={styles.count}>{title.length}</p>/{32}
                  </p>
                )}
              </div>
              <div className={styles.bar} />
              <div className={styles.contentContainer}>
                <div className={styles.textareaContainer}>
                  <textarea
                    className={styles.textarea}
                    placeholder="내용을 입력해주세요."
                    value={content}
                    maxLength={300}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  {content && (
                    <div className={styles.contentCount}>
                      <div className={styles.countTotal}>
                        <p className={styles.count}>{content.length}</p>/{300}
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.bar} />
              </div>
              <div className={styles.tagContainer}>
                <div className={styles.tagInputContainer}>
                  <label className={styles.label}>태그</label>
                  <div className={styles.inputContainer}>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="태그를 10개까지 추가할 수 있어요"
                      maxLength={10}
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    {tag && (
                      <div className={styles.countTotal}>
                        <p className={styles.count}>{tag.length}</p>/{10}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.tagList}>
                  {tags.map((tag, index) => (
                    <Chip
                      size="m"
                      type="filled-assistive"
                      key={index}
                      rightIcon={
                        <div
                          onClick={() => removeTag(index)}
                          role="button"
                          tabIndex={0}
                          className={styles.deleteTag}
                        >
                          <IconComponent
                            name="deleteTag"
                            width={16}
                            height={16}
                            alt="태그 제거"
                            isBtn
                          />
                        </div>
                      }
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className={styles.optionContainer}>
                <label className={styles.label}>추가 옵션</label>
                <div className={styles.options}>
                  <p className={styles.subtitle}>AI 생성 작품이에요</p>
                  <div
                    className={`${styles.option} ${isAI ? styles.selected : ""}`}
                    onClick={() => setIsAI((prev) => !prev)}
                  >
                    <IconComponent
                      name={isAI ? "checkedbox" : "checkbox"}
                      width={24}
                      height={24}
                      isBtn
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
