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
  const [nameError, setNameError] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [profileId, setProfileId] = useState<string>("");
  const [profileIdError, setProfileIdError] = useState<string>("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isError, setIsError] = useState(false);
  const closeModal = useModalStore((state) => state.closeModal);
  const { restoreScrollPosition } = useScrollRestoration("profileEdit-scroll");
  const { showToast } = useToast();
  const isMobile = useDeviceStore((state) => state.isMobile);
  useIsMobile();

  useEffect(() => {
    if (myData) {
      setName(myData.name?.trim() || "");
      setDescription(myData.description || "");
      setProfileId(myData.url || "");

      if (myData.links?.length) {
        const processedLinks = myData.links.map((link) => {
          let processedLink: LinkItem = { ...link };
          const known = ["X", "인스타그램", "유튜브", "픽시브", "이메일"];
          if (!known.includes(link.linkName)) {
            processedLink = {
              ...processedLink,
              customName: link.linkName,
              linkName: "직접 입력",
            };
          }
          return processedLink;
        });
        setLinks(processedLinks);
      } else {
        setLinks([]);
      }
    }

    const scrollPos = sessionStorage.getItem("profileEdit-scroll");
    if (scrollPos !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("profileEdit-scroll");
    }
  }, [myData]);

  const mutation = useMutation((newInfo: UpdateUserRequest) => putMyInfo(newInfo), {
    onSuccess: () => {
      showToast("프로필 정보가 변경되었습니다!", "success");
      closeModal();
      refetch();
      router.reload();
      setNameError("");
    },
    onError: (error: AxiosError<UpdateProfileConflictResponse>) => {
      if (error.response?.status === 409) {
        setIsError(true);
        const message = error.response?.data?.message;
        if (message === "NAME") {
          setNameError("이미 사용 중인 닉네임입니다.");
        } else if (message === "URL") {
          setProfileIdError("이미 사용 중인 프로필 URL입니다.");
        } else {
          showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
        }
      }
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError("");
  };

  const handleProfileIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileId(e.target.value.trim());
    if (profileIdError) setProfileIdError("");
  };

  const handlePlatformChange = (index: number, platform: string) => {
    const newLinks = [...links];
    newLinks[index] = {
      ...newLinks[index],
      linkName: platform,
      customName: platform === "직접 입력" ? "" : undefined,
    };
    setLinks(newLinks);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    const platform = newLinks[index].linkName;
    let cleanValue = value.trim();

    if (platform !== "직접 입력" && platform !== "이메일") {
      const baseUrl = PLATFORM_URLS[platform];
      cleanValue = cleanValue
        .replace(/^https?:\/\/(www\.)?/, "")
        .replace(baseUrl, "")
        .replace(/^@/, "")
        .replace(/\//g, "");
    }

    newLinks[index].link = cleanValue;
    setLinks(newLinks);
  };

  const handleAddLink = () => {
    setLinks([...links, { linkName: "X", link: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedProfileId = profileId.trim();
    setNameError("");
    setProfileIdError("");

    if (!trimmedName) return setNameError("닉네임을 입력해주세요.");
    if (trimmedName.length < 2) return showToast("닉네임은 두 글자 이상 입력해야 합니다.", "error");
    if (!trimmedProfileId) return setProfileIdError("프로필 URL을 입력해주세요.");
    if (!isValidProfileIdFormat(trimmedProfileId))
      return setProfileIdError("숫자, 영문(소문자), 언더바(_)만 입력 가능합니다.");
    if (isForbiddenProfileId(trimmedProfileId))
      return setProfileIdError("사용할 수 없는 ID입니다.");

    const hasInvalidLinks = links.some((l) => (l.linkName && !l.link) || (!l.linkName && l.link));
    if (hasInvalidLinks) return showToast("링크 이름과 URL을 모두 입력해주세요.", "error");

    const formattedLinks = links
      .filter((l) => l.linkName && l.link)
      .map((l) => {
        const name = l.linkName === "직접 입력" ? l.customName || "custom" : l.linkName;
        let url = l.link.trim();
        const hasProtocol = /^https?:\/\//.test(url);
        if (!hasProtocol) {
          const base = PLATFORM_URLS[l.linkName] || "";
          url = l.linkName === "유튜브" ? `https://${base}@${url}` : `https://${base}${url}`;
        }
        return { linkName: name, link: url };
      });

    const updatedInfo: UpdateUserRequest = {
      name: trimmedName,
      description,
      links: formattedLinks,
      url: trimmedProfileId,
    };

    mutation.mutate(updatedInfo);
  };

  if (isLoading || name === null) return <Loader />;

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
            onChange={handleNameChange}
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
            onChange={handleProfileIdChange}
            isError={!!profileIdError}
            errorMessage={profileIdError}
            prefix="www.grimity.com/"
          />
          <div className={styles.linkContainer}>
            <label className={styles.label}>외부 링크</label>
            {links.map((link, index) => {
              const isFullUrl = /^https?:\/\//.test(link.link);
              const prefix = isFullUrl ? "" : PLATFORM_URLS[link.linkName] || "";

              return (
                <div key={index} className={styles.linkInputContainer}>
                  {link.linkName === "직접 입력" ? (
                    <TextField
                      placeholder="링크 이름"
                      value={link.customName || ""}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[index].customName = e.target.value;
                        setLinks(newLinks);
                      }}
                    />
                  ) : (
                    <SelectBox
                      options={Object.keys(PLATFORM_URLS).map((k) => ({ value: k, label: k }))}
                      value={link.linkName}
                      onChange={(val) => handlePlatformChange(index, val)}
                    />
                  )}
                  <TextField
                    placeholder="링크 입력"
                    value={link.link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    prefix={prefix}
                  />
                  <div onClick={() => handleRemoveLink(index)} className={styles.removeLinkButton}>
                    <IconComponent name="deleteLink" size={24} isBtn />
                  </div>
                </div>
              );
            })}
            <div className={styles.addBtn}>
              <Button
                type="outlined-assistive"
                size="m"
                leftIcon={<IconComponent name="addLink" size={16} isBtn />}
                onClick={handleAddLink}
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
