import styles from "./Vote.module.scss";
import { Button } from "ui/Button/Button";
import { parsAddress } from "utils/parsAddress";
import PROFILE from "assets/profile.png";
import { DATAS } from "../VoteDatas/datas";
import { useDispatch } from "react-redux";
import { setVoteModalData } from "store/slicers/account";
import { useClaim } from "hooks/useClaim";

interface VoteTable {
  openModal: () => void;
  index: number;
  description: string;
}

const Vote = ({ openModal, description, index }: VoteTable) => {
  const dispatch = useDispatch();
  const { isClaimer } = useClaim();
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
            dispatch(setVoteModalData(DATAS[index]));
            openModal();
            isClaimer();
          }}
        >
          VOTE
        </Button>

        <div className={styles.info}>
          <img src={PROFILE}></img>
          <div>{parsAddress("0x114b242d931b47d5cdcee7af065856f70ee278c4")}</div>
        </div>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export { Vote };
