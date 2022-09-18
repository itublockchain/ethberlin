import styles from "./VoteModal.module.scss";
import { ModalController } from "hooks/useModal";
import { Modal, Button } from "ui";
import { Option } from "components";
import { useState } from "react";
import { useVoteContract } from "hooks/useVoteContract";
import { useSelector } from "react-redux";
const VoteModal = ({ modal }: { modal: ModalController }) => {
  const [selected, setSelected] = useState<number>(0);
  const { voteElection } = useVoteContract();
  const voteModalDatas = useSelector(
    (state: any) => state.account.voteModalDatas
  );
  return (
    <Modal isOpen={modal.isOpen} close={modal.close} className={styles.wrapper}>
      <div className={styles.description}>{voteModalDatas.description}</div>
      <div className={styles.candidates}>
        <Option
          info="Vitalik Buterin"
          index={0}
          selected={selected}
          setSelected={setSelected}
        />
        <Option
          info="Gavin Wood"
          index={1}
          selected={selected}
          setSelected={setSelected}
        />
        <Option
          info="Alim Sahin"
          index={2}
          selected={selected}
          setSelected={setSelected}
        />
        <Option
          info="Kemal Kilicdaroglu"
          index={3}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      <div className={styles.warning}>You have a vote token to claim!</div>

      <div className={styles.buttons}>
        <Button
          className={styles.swap}
          color="black"
          width={"170px"}
          height="45px"
          fontWeight="fw800"
          onClick={() => {
            voteElection(selected, selected); // update params
          }}
        >
          Send Vote
        </Button>
        <Button
          className={styles.swap}
          color="black"
          width={"170px"}
          height="45px"
          fontWeight="fw800"
          onClick={() => {}}
        >
          Get Privacy
        </Button>
      </div>
    </Modal>
  );
};

export { VoteModal };
