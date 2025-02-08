import BoardPopular from "@/components/Board/BoardPopular/BoardPopular";
import styles from "./Board.module.scss";
import BoardAll from "./BoardAll/BoardAll";

export default function Board() {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <BoardPopular />
        <div className={styles.bar} />
        <BoardAll />
      </div>
    </div>
  );
}
