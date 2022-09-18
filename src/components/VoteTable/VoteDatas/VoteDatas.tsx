import styles from "./VoteDatas.module.scss";
import { Vote } from "components";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DATAS } from "./datas";

interface VoteTable {
  openModal: () => void;
}

const VoteDatas = ({ openModal }: VoteTable) => {
  const voteDatas = useSelector((state: any) => state.account.VoteDatas);
  const [isThereDatas, setIsThereDatas] = useState(false);
  useEffect(() => {
    if (voteDatas !== null) {
      setIsThereDatas(true);
    }
  }, [voteDatas]);
  return (
    <div className={styles.wrapper}>
      {isThereDatas
        ? DATAS.map((data: any, i: number) => {
            return (
              <Vote
              key={i}
                openModal={openModal}
                description={data.description}
                index={i}
              />
            );
          })
        : "There is no voting!"}
      {/* <Vote openModal={openModal} />
      <Vote openModal={openModal} />
      <Vote openModal={openModal} />
      <Vote openModal={openModal} />
      <Vote openModal={openModal} /> */}
    </div>
  );
};

export { VoteDatas };
