import { useCallback } from "react";
import styles from "./ActionBar.module.scss";
import { ActionBarProps } from "./ActionBar.types";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import Dropdown from "@/components/Dropdown/Dropdown";

export default function ActionBar({ config, isAuthor = false, className = "" }: ActionBarProps) {
  const { like, save, dropdown } = config;

  const handleLikeClick = useCallback(async () => {
    if (!like.allowSelfLike && isAuthor) {
      return;
    }

    await like.onToggle();
  }, [like, isAuthor]);

  const handleSaveClick = useCallback(async () => {
    await save.onToggle();
  }, [save]);

  const renderDropdownTrigger = () => {
    if (dropdown.isMobile) {
      return (
        <div className={styles.menuBtn}>
          <IconComponent name="meatball" size={20} />
        </div>
      );
    }

    return <IconComponent name="meatball" padding={8} size={24} isBtn />;
  };

  return (
    <div className={`${styles.btnContainer} ${className}`}>
      <div className={styles.likeBtn} onClick={handleLikeClick}>
        <Button
          size="l"
          type="outlined-assistive"
          leftIcon={
            <IconComponent name={like.isLiked ? like.iconNameOn : like.iconNameOff} size={20} />
          }
        >
          {like.count}
        </Button>
      </div>

      <div className={styles.saveBtn} onClick={handleSaveClick}>
        <IconComponent name={save.isSaved ? save.iconNameOn : save.iconNameOff} size={20} />
      </div>

      <div className={styles.dropdown}>
        <Dropdown trigger={renderDropdownTrigger()} menuItems={dropdown.menuItems} />
      </div>
    </div>
  );
}
