import { CreateVote, VoteButtons, VoteDatas } from "components";
import styles from "./VoteTable.module.scss";

interface VoteTable {
  openModal: () => void;
}
const VoteTable = ({ openModal }: VoteTable) => {
  return (
    <div className={styles.wrapper}>
      {/* <div className={styles.buttons}>
        <VoteButtons />
        <CreateVote />
      </div> */}
      <div className={styles.datas}>
        <VoteDatas openModal={openModal} />
      </div>
    </div>
  );
};

export { VoteTable };
