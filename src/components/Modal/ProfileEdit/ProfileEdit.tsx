import styles from "./ProfileEdit.module.scss";
import { useEffect, useState } from "react";
import { useModalStore } from "@/states/modalStore";
import { useMutation } from "react-query";
import TextField from "@/components/TextField/TextField";
import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import { useToast } from "@/hooks/useToast";
import { useMyData } from "@/api/users/getMe";
import { UpdateUserRequest, UpdateProfileConflictResponse, putMyInfo } from "@/api/users/putMe";
import { AxiosError } from "axios";
import Loader from "@/components/Layout/Loader/Loader";
import router from "next/router";
import { useDeviceStore } from "@/states/deviceStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { isValidProfileIdFormat, isForbiddenProfileId } from "@/utils/isValidProfileId";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { SelectBox } from "@/components/SelectBox/SelectBox";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface LinkItem {
  linkName: string;
  link: string;
  customName?: string;
}

// 플랫폼별 기본 URL
const PLATFORM_URLS: Record<string, string> = {
  X: "x.com/",
  인스타그램: "instagram.com/",
  유튜브: "youtube.com/",
  픽시브: "pixiv.net/users/",
  이메일: "",
  "직접 입력": "",
};

export default function ProfileEdit() {
  const { data: myData, isLoading, refetch } = useMyData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profileId, setProfileId] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [nameError, setNameError] = useState("");
  const [profileIdError, setProfileIdError] = useState("");
  const [isError, setIsError] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);

  const closeModal = useModalStore((s) => s.closeModal);
  const { restoreScrollPosition } = useScrollRestoration("profileEdit-scroll");
  const { showToast } = useToast();
  const isMobile = useDeviceStore((s) => s.isMobile);
  useIsMobile();

  useEffect(() => {
    if (myData) {
      setName(myData.name?.trim() || "");
      setDescription(myData.description || "");
      setProfileId(myData.url || "");

      const processed =
        myData.links?.map((link) => {
          const known = Object.keys(PLATFORM_URLS);
          return !known.includes(link.linkName)
            ? { ...link, customName: link.linkName, linkName: "직접 입력" }
            : link;
        }) || [];

      setLinks(processed);
    }

    const scrollPos = sessionStorage.getItem("profileEdit-scroll");
    if (scrollPos !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("profileEdit-scroll");
    }
  }, [myData]);

  const mutation = useMutation((data: UpdateUserRequest) => putMyInfo(data), {
    onSuccess: () => {
      showToast("프로필 정보가 변경되었습니다!", "success");
      closeModal();
      refetch();
      router.reload();
    },
    onError: (error: AxiosError<UpdateProfileConflictResponse>) => {
      if (error.response?.status === 409) {
        setIsError(true);
        const msg = error.response?.data?.message;
        if (msg === "NAME") setNameError("이미 사용 중인 닉네임입니다.");
        else if (msg === "URL") setProfileIdError("이미 사용 중인 프로필 URL입니다.");
        else showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      }
    },
  });

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedProfileId = profileId.trim();

    if (!trimmedName) return setNameError("닉네임을 입력해주세요.");
    if (trimmedName.length < 2) return showToast("닉네임은 두 글자 이상 입력해야 합니다.", "error");
    if (!trimmedProfileId) return setProfileIdError("프로필 URL을 입력해주세요.");
    if (!isValidProfileIdFormat(trimmedProfileId))
      return setProfileIdError("숫자, 영문(소문자), 언더바(_)만 입력 가능합니다.");
    if (isForbiddenProfileId(trimmedProfileId))
      return setProfileIdError("사용할 수 없는 ID입니다.");

    const hasInvalidLinks = links.some((l) => (l.linkName && !l.link) || (!l.linkName && l.link));
    if (hasInvalidLinks) return showToast("링크 이름과 URL을 모두 입력해주세요.", "error");

    const formattedLinks: { linkName: string; link: string }[] = [];

    for (const l of links) {
      if (!l.linkName || !l.link) continue;

      const name = l.linkName === "직접 입력" ? l.customName || "custom" : l.linkName;
      let url = l.link.trim();

      if (!/^https?:\/\//i.test(url)) {
        const base = PLATFORM_URLS[l.linkName] || "";
        url = `https://${base}${url}`;
      }

      try {
        new URL(url);
        formattedLinks.push({ linkName: name, link: url });
      } catch {
        return showToast("올바른 URL 형식이 아닙니다.", "error");
      }
    }

    mutation.mutate({
      name: trimmedName,
      description,
      url: trimmedProfileId,
      links: formattedLinks,
    });
  };

  const handleLinkDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newLinks = [...links];
    const [moved] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, moved);
    setLinks(newLinks);
  };

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>프로필 편집</h2>
        </div>
      )}
      <div className={styles.textBtnContainer}>
        <div className={styles.textContainer}>
          <TextField
            label="닉네임"
            placeholder="프로필에 노출될 닉네임을 입력해주세요."
            maxLength={12}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            isError={!!nameError}
            errorMessage={nameError}
          />
          <div className={styles.contentContainer}>
            <label className={styles.label} htmlFor="description">
              자기 소개
            </label>
            <div className={styles.textareaContainer}>
              <textarea
                id="description"
                className={styles.textarea}
                placeholder="자유롭게 소개해주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
              />
              {description && (
                <div className={styles.countTotal}>
                  <p className={styles.count}>{description.length}</p>/200
                </div>
              )}
            </div>
          </div>
          <TextField
            label="그리미티 URL"
            placeholder="url을 입력해주세요."
            maxLength={20}
            value={profileId}
            onChange={(e) => {
              setProfileId(e.target.value.trim());
              if (profileIdError) setProfileIdError("");
            }}
            isError={!!profileIdError}
            errorMessage={profileIdError}
            prefix="www.grimity.com/"
          />
          <div className={styles.linkContainer}>
            <div className={styles.editBar}>
              <label className={styles.label}>외부 링크</label>
              <p
                className={`${styles.editOrderBtn} ${isEditingOrder ? styles.completeBtn : ""}`}
                onClick={() => setIsEditingOrder((prev) => !prev)}
              >
                {isEditingOrder ? "완료" : "순서 편집"}
              </p>
            </div>

            <DragDropContext onDragEnd={handleLinkDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {links.map((link, index) => {
                      return (
                        <Draggable
                          key={index}
                          draggableId={`link-${index}`}
                          index={index}
                          isDragDisabled={!isEditingOrder}
                        >
                          {(provided) => (
                            <div
                              className={styles.linkInputContainer}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              {link.linkName === "직접 입력" ? (
                                <div className={styles.linkName}>
                                  <TextField
                                    placeholder="링크 이름"
                                    value={link.customName || ""}
                                    onChange={(e) => {
                                      const newLinks = [...links];
                                      newLinks[index].customName = e.target.value;
                                      setLinks(newLinks);
                                    }}
                                  />
                                </div>
                              ) : (
                                <SelectBox
                                  options={Object.keys(PLATFORM_URLS).map((k) => ({
                                    value: k,
                                    label: k,
                                  }))}
                                  value={link.linkName}
                                  onChange={(val) => {
                                    const newLinks = [...links];
                                    newLinks[index] = {
                                      ...newLinks[index],
                                      linkName: val,
                                      customName: val === "직접 입력" ? "" : undefined,
                                    };
                                    setLinks(newLinks);
                                  }}
                                />
                              )}
                              <TextField
                                placeholder={
                                  link.linkName === "직접 입력"
                                    ? "전체 URL을 입력해주세요."
                                    : `${PLATFORM_URLS[link.linkName]}`
                                }
                                value={link.link}
                                onChange={(e) => {
                                  const value = e.target.value.trim();
                                  const newLinks = [...links];
                                  newLinks[index].link = value;
                                  setLinks(newLinks);
                                }}
                              />
                              {isEditingOrder ? (
                                <div {...provided.dragHandleProps} className={styles.dragHandle}>
                                  <IconComponent name="editOrder" size={16} isBtn />
                                </div>
                              ) : (
                                <div
                                  onClick={() => setLinks(links.filter((_, i) => i !== index))}
                                  className={styles.removeLinkButton}
                                >
                                  <IconComponent name="deleteLink" size={24} isBtn />
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className={styles.addBtn}>
              <Button
                type="outlined-assistive"
                size="m"
                leftIcon={<IconComponent name="addLink" size={16} isBtn />}
                onClick={() => setLinks([...links, { linkName: "X", link: "" }])}
              >
                링크 추가
              </Button>
            </div>
          </div>
        </div>
        <Button
          size="l"
          type="filled-primary"
          onClick={handleSave}
          disabled={name.trim().length < 2 || mutation.isLoading || !!profileIdError}
        >
          변경 내용 저장
        </Button>
      </div>
    </div>
  );
}
