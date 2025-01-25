import styles from "./ProfileEdit.module.scss";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";
import { useMutation } from "react-query";
import TextField from "@/components/TextField/TextField";
import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import { useToast } from "@/utils/useToast";
import { useMyData } from "@/api/users/getMe";
import { MyInfoRequest, putMyInfo } from "@/api/users/putMe";
import { AxiosError } from "axios";
import Loader from "@/components/Layout/Loader/Loader";
import router from "next/router";

export default function ProfileEdit() {
  const { data: myData, isLoading, refetch } = useMyData();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [links, setLinks] = useState<{ linkName: string; link: string }[]>([
    { linkName: "", link: "" },
  ]);
  const [isError, setIsError] = useState(false);
  const [, setModal] = useRecoilState(modalState);
  const { showToast } = useToast();

  useEffect(() => {
    if (myData) {
      setName(myData.name?.replace(/\s+$/, "") || "");
      setDescription(myData.description || "");
      setLinks(myData.links?.length ? myData.links : [{ linkName: "", link: "" }]);
    }
  }, [myData]);

  const mutation = useMutation((newInfo: MyInfoRequest) => putMyInfo(newInfo), {
    onSuccess: () => {
      showToast("프로필 정보가 변경되었습니다!", "success");
      setModal({ isOpen: false, type: null, data: null });
      refetch();
      router.reload();
      setNameError("");
    },
    onError: (error: AxiosError) => {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      if (error.response?.status === 409) {
        setIsError(true);
        setNameError("닉네임이 이미 존재합니다.");
      }
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setName(inputValue);
    if (nameError) {
      setNameError("");
    }
  };

  const handleAddLink = () => {
    if (links.length < 3) {
      setLinks([...links, { linkName: "", link: "" }]);
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: "linkName" | "link", value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const handleSave = () => {
    setNameError("");
    const nameWithoutTrailingSpace = name?.replace(/\s+$/, "") || "";

    if (!nameWithoutTrailingSpace) {
      setNameError("닉네임을 입력해주세요.");
      return;
    }

    const filteredLinks = links.filter(
      (link) => link.linkName.trim() !== "" || link.link.trim() !== ""
    );

    const updatedInfo: MyInfoRequest = {
      name: nameWithoutTrailingSpace,
      description,
      links: filteredLinks,
    };

    mutation.mutate(updatedInfo);
  };

  if (isLoading || name === null) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>프로필 편집</h2>
      </div>
      <div className={styles.textBtnContainer}>
        <div className={styles.textContainer}>
          <TextField
            label="닉네임"
            placeholder="프로필에 노출될 닉네임을 입력해주세요."
            errorMessage="중복된 닉네임입니다."
            maxLength={12}
            value={name}
            onChange={handleNameChange}
            isError={isError}
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
              />
              {description && (
                <p className={styles.countTotal}>
                  <p className={styles.count}>{description.length}</p>
                  /50
                </p>
              )}
            </div>
          </div>
          <div className={styles.linkContainer}>
            <label className={styles.label}>외부 링크</label>
            {links.map((link, index) => (
              <div key={index} className={styles.linkInputContainer}>
                <TextField
                  placeholder="링크 주소"
                  value={link.link}
                  onChange={(e) => handleLinkChange(index, "link", e.target.value)}
                />
                <div className={styles.linkName}>
                  <TextField
                    placeholder="링크 이름"
                    value={link.linkName}
                    onChange={(e) => handleLinkChange(index, "linkName", e.target.value)}
                  />
                </div>
                <div onClick={() => handleRemoveLink(index)} className={styles.removeLinkButton}>
                  <IconComponent name="deleteLink" width={24} height={24} alt="링크 삭제" isBtn />
                </div>
              </div>
            ))}
            {links.length < 3 && (
              <div className={styles.addBtn}>
                <Button
                  type="outlined-assistive"
                  size="m"
                  leftIcon=<IconComponent name="addLink" width={16} height={16} isBtn />
                  onClick={handleAddLink}
                >
                  링크 추가
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button size="l" type="filled-primary" onClick={handleSave} disabled={mutation.isLoading}>
          변경 내용 저장
        </Button>
      </div>
    </div>
  );
}
