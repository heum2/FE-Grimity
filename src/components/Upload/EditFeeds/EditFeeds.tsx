import { useState, useEffect, useRef, useCallback } from "react";
import Button from "../../Button/Button";
import styles from "./EditFeeds.module.scss";
import IconComponent from "../../Asset/Icon";
import { useToast } from "@/hooks/useToast";
import { postPresignedUrls, PresignedUrlRequest } from "@/api/aws/postPresigned";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { CreateFeedRequest, putEditFeeds } from "@/api/feeds/putFeedsId";
import { useDetails } from "@/api/feeds/getFeedsId";
import { EditFeedsProps } from "./EditFeeds.type";
import Loader from "@/components/Layout/Loader/Loader";
import Chip from "@/components/Chip/Chip";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableImage from "../DraggableImage/DraggableImage";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "@/states/modalState";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";
import { authState } from "@/states/authState";
import { imageUrl } from "@/constants/imageUrl";

export default function EditFeeds({ id }: EditFeedsProps) {
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const { data: feedData, isLoading } = useDetails(id);
  const router = useRouter();
  const [images, setImages] = useState<{ name: string; originalName: string; url: string }[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [isAI, setIsAI] = useState(false);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [, setModal] = useRecoilState(modalState);
  const { showToast } = useToast();
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  useIsMobile();

  useEffect(() => {
    if (!isLoggedIn) {
      showToast("로그인 후 작성 가능합니다.", "warning");
      router.push("/");
    } else if (user_id !== feedData?.author.id) {
      router.push("/");
    }
  }, [isLoggedIn, router, user_id, feedData]);

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

  useEffect(() => {
    if (feedData) {
      const initialImages = feedData.cards.map((name) => ({
        name,
        url: name,
        originalName: name,
      }));

      setTitle(feedData.title);
      setContent(feedData.content);
      // setIsAI(feedData.isAI);
      setTags(feedData.tags);
      setImages(initialImages);
      setThumbnailUrl(feedData.thumbnail);
      setThumbnailName(feedData.thumbnail);
    }
  }, [feedData]);

  // 변경 사항 감지
  useEffect(() => {
    const hasChanges =
      title !== feedData?.title ||
      content !== feedData?.content ||
      // isAI !== feedData?.isAI ||
      thumbnailUrl !== feedData?.thumbnail ||
      JSON.stringify(tags) !== JSON.stringify(feedData?.tags) ||
      JSON.stringify(images) !== JSON.stringify(feedData?.cards);
    setHasUnsavedChanges(hasChanges);
  }, [feedData, images, title, content, tags]);

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

  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            console.error("Canvas context가 존재하지 않음");
            reject(new Error("Canvas context not found"));
            return;
          }

          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.error("WebP 변환 실패");
                reject(new Error("WebP 변환 실패"));
                return;
              }
              const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
                type: "image/webp",
              });
              resolve(webpFile);
            },
            "image/webp",
            0.8,
          );
        };
        img.onerror = (error) => {
          console.error("이미지 로드 실패", error);
          reject(error);
        };
      };
      reader.onerror = (error) => {
        console.error("FileReader 실패", error);
        reject(error);
      };
    });
  };

  const { mutate: editFeed } = useMutation((data: CreateFeedRequest) => putEditFeeds(id, data), {
    onSuccess: () => {
      hasUnsavedChangesRef.current = false;
      showToast("수정이 완료되었습니다!", "success");
      router.push(`/feeds/${id}`);
    },
    onError: (error: AxiosError) => {
      showToast("수정 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
      if (error.response?.status === 400) {
        showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
      }
    },
  });

  const getFileExtension = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "webp") {
      return ext;
    }
    return null;
  };

  const processFile = async (file: File): Promise<File | null> => {
    const ext = getFileExtension(file.name);

    if (!ext) {
      showToast("지원되지 않는 파일 형식입니다. (jpg, png, jpeg, webp만 가능)", "error");
      return null;
    }

    if (ext === "png" || ext === "jpg" || ext === "jpeg") {
      return await convertToWebP(file);
    }

    return file;
  };

  const uploadImagesToServer = async (files: FileList) => {
    try {
      const remainingSlots = 10 - images.length;
      if (remainingSlots <= 0) {
        showToast("최대 10장의 그림만 업로드할 수 있습니다.", "error");
        return;
      }

      const filesToUpload = Array.from(files)
        .slice(0, remainingSlots)
        .filter((file) => file.type.startsWith("image/"));

      const processedFiles = (await Promise.all(filesToUpload.map(processFile))).filter(
        Boolean,
      ) as File[];

      if (processedFiles.length === 0) return;

      const requests: PresignedUrlRequest[] = processedFiles.map(() => ({
        type: "feed",
        ext: "webp",
      }));

      if (requests.length === 0) return;

      const presignedUrls = await postPresignedUrls(requests);

      const uploadPromises = processedFiles.map((file, index) =>
        fetch(presignedUrls[index].url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        }),
      );

      await Promise.all(uploadPromises);

      const newImages = processedFiles.map((file, index) => ({
        name: presignedUrls[index].imageName,
        originalName: file.name,
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

    if (!content.trim()) {
      showToast("내용을 입력해주세요.", "error");
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
        title: "수정사항을 업로드할까요?",
        confirmBtn: "업로드",
        onClick: handleSave,
      },
      isComfirm: true,
    });
  };

  const handleSave = async () => {
    setModal({
      isOpen: false,
      type: null,
      data: null,
      isComfirm: false,
    });

    editFeed({
      title,
      cards: images.map((image) => image.name.replace(`${imageUrl}/`, "")),
      // isAI,
      content,
      tags,
      thumbnail: thumbnailName.replace(`${imageUrl}/`, ""),
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && tag.trim() !== "") {
      event.preventDefault();

      if (tag.trim().length < 2) {
        showToast("태그는 두 글자 이상이어야 합니다.", "error");
        return;
      }

      if (tags.length >= 10) {
        showToast("태그는 최대 10개까지 추가할 수 있어요", "error");
        return;
      }

      const newTag = tag.replace(/#/g, "").trim();

      // 중복 태그 방지
      if (!tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      } else {
        showToast("이미 추가된 태그입니다.", "error");
      }

      setTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // 가로 스크롤 시 세로 스크롤 막기
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isScrollable = container.scrollWidth > container.clientWidth;

    if (!isScrollable) return;

    e.preventDefault();
    container.scrollLeft += e.deltaY;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  if (isLoading) return <Loader />;

  const isDisabled = title.trim() === "" || content.trim() === "";

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        {!isMobile && (
          <div className={styles.uploadBtnContainer}>
            <Button size="m" type="filled-primary" disabled={isDisabled} onClick={handleSubmit}>
              수정 완료
            </Button>
          </div>
        )}
        <div className={styles.sectionContainer}>
          <section className={styles.imageSection} onDrop={handleDrop} onDragOver={handleDragOver}>
            <div className={styles.addBtnContainer}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                  {(provided) => (
                    <div
                      className={styles.imageContainer}
                      ref={(el) => {
                        provided.innerRef(el);
                        containerRef.current = el;
                      }}
                      {...provided.droppableProps}
                    >
                      {images.map((image, index) => (
                        <DraggableImage
                          key={image.name}
                          image={image}
                          index={index}
                          name={image.originalName}
                          moveImage={moveImage}
                          removeImage={removeImage}
                          isThumbnail={thumbnailUrl === image.url}
                          onThumbnailSelect={() => selectThumbnail(image.url)}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {/* PC */}
              {!isMobile && !isTablet && images.length < 10 && (
                <label htmlFor="file-upload" className={styles.uploadBtn}>
                  <div tabIndex={0}>
                    <img
                      src="/image/upload.svg"
                      width={240}
                      height={240}
                      alt="그림 추가"
                      loading="lazy"
                    />
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/png, image/jpeg, image/jpg"
                      hidden
                      onChange={(e) => e.target.files && uploadImagesToServer(e.target.files)}
                    />
                  </div>
                </label>
              )}
              {/* 모바일, 태블릿: 이미지 없을 때 */}
              {(isMobile || isTablet) && images.length === 0 && images.length < 10 && (
                <label htmlFor="file-upload" className={styles.uploadBtn}>
                  <div tabIndex={0}>
                    <img
                      src="/image/upload.svg"
                      width={240}
                      height={240}
                      alt="그림 추가"
                      loading="lazy"
                    />
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/png, image/jpeg, image/jpg"
                      hidden
                      onChange={(e) => e.target.files && uploadImagesToServer(e.target.files)}
                    />
                  </div>
                </label>
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg"
              style={{ display: "none" }}
              onChange={(e) => e.target.files && uploadImagesToServer(e.target.files)}
            />
          </section>
          {/* 모바일, 태블릿: 이미지가 하나 이상일 때 */}
          {(isMobile || isTablet) && images.length > 0 && images.length < 10 && (
            <label htmlFor="file-upload" style={{ width: "100%" }}>
              <div className={styles.imageAddBtn}>
                <IconComponent name="mobileAddImage" size={16} />
                이미지 추가
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg"
                hidden
                onChange={(e) => e.target.files && uploadImagesToServer(e.target.files)}
              />
            </label>
          )}
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
                  <div className={styles.countTotal}>
                    <p className={styles.count}>{title.length}</p>/{32}
                  </div>
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
                          <IconComponent name="deleteTag" size={16} isBtn />
                        </div>
                      }
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
              {/* <div className={styles.optionContainer}>
                <label className={styles.label}>추가 옵션</label>
                <div className={styles.options}>
                  <p className={styles.subtitle}>AI 생성 작품이에요</p>
                  <div
                    className={`${styles.option} ${isAI ? styles.selected : ""}`}
                    onClick={() => setIsAI((prev) => !prev)}
                  >
                    <IconComponent name={isAI ? "checkedbox" : "checkbox"} size={14} isBtn />
                  </div>
                </div>
              </div> */}
            </div>
          </section>
        </div>
        {isMobile && (
          <Button size="l" type="filled-primary" disabled={isDisabled} onClick={handleSubmit}>
            수정 완료
          </Button>
        )}
      </div>
    </div>
  );
}
