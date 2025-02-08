import BoardPopular from "@/components/Board/BoardPopular/BoardPopular";
import Button from "@/components/Button/Button";
import Link from "next/link";
import styles from "./Board.module.scss";
import IconComponent from "../Asset/Icon";

export default function Board() {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <BoardPopular />
        <div className={styles.bar} />
        <Link href="/board/write">
          <Button
            size="l"
            type="outlined-assistive"
            leftIcon={<IconComponent name="writePost" width={20} height={20} />}
          >
            글쓰기
          </Button>
        </Link>
      </div>
    </div>
  );
}
