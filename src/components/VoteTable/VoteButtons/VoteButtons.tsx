import styles from "./VoteButtons.module.scss";
import { Button } from "ui/Button/Button";
import { useState } from "react";

enum VOTES {
  "ALLVOTES",
  "MYVOTES",
}
const VoteButtons = () => {
  const [selected, setSelected] = useState<VOTES>(VOTES.ALLVOTES);
  return (
    <div className={styles.wrapper}>
      <Button
        color={selected === VOTES.ALLVOTES ? "green" : "black"}
        width="120px"
        height="45px"
        className={selected === VOTES.ALLVOTES ? styles.selected : styles.not}
        onClick={() => {
          setSelected(VOTES.ALLVOTES);
        }}
      >
        All Votes
        {/* {selected === VOTES.ALLVOTES ? (
          <span className={styles.toLeft}></span>
        ) : (
          <span className={styles.toRight}></span>
        )} */}
      </Button>
      <Button
        color={selected === VOTES.MYVOTES ? "green" : "black"}
        width="120px"
        height="45px"
        className={selected === VOTES.MYVOTES ? styles.selected : styles.not}
        onClick={() => {
          setSelected(VOTES.MYVOTES);
        }}
      >
        My Votes<span className={styles.left}></span>
        {/* {selected === VOTES.ALLVOTES ? (
          <span className={styles.toLeft}></span>
        ) : (
          <span className={styles.toRight}></span>
        )} */}
      </Button>
    </div>
  );
};

export { VoteButtons };
