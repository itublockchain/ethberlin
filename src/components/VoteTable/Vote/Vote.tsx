import styles from "./Vote.module.scss";
import { Button } from "ui/Button/Button";
import { parsAddress } from "utils/parsAddress";
import PROFILE from "assets/profile.png";

interface VoteTable {
  openModal: () => void;
}

const Vote = ({ openModal }: VoteTable) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.profile}>
        <Button
          className={styles.swap}
          color="black"
          width={"120px"}
          height="45px"
          fontWeight="fw800"
          onClick={() => {
            openModal();
          }}
        >
          VOTE
        </Button>

        <div className={styles.info}>
          <img src={PROFILE}></img>
          <div>{parsAddress("0x114b242d931b47d5cdcee7af065856f70ee278c4")}</div>
        </div>
      </div>
      <div className={styles.description}>
        There are some voting description here!{" "}
      </div>
    </div>
  );
};

export { Vote };
