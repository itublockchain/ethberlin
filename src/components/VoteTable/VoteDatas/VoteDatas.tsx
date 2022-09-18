import styles from "./VoteDatas.module.scss";
import { Vote } from "components";

interface VoteTable {
  openModal: () => void;
}

const VoteDatas = ({ openModal }: VoteTable) => {
  return (
    <div className={styles.wrapper}>
      <Vote openModal={openModal}/>
      <Vote openModal={openModal}/>
      <Vote openModal={openModal}/>
      <Vote openModal={openModal}/>
      <Vote openModal={openModal}/>
    </div>
  );
};

export { VoteDatas };
