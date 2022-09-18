import styles from "./VoteModal.module.scss";
import { ModalController } from "hooks/useModal";
import { Modal, Button } from "ui";
import { Option } from "components";
import { useState } from "react";
const VoteModal = ({ modal }: { modal: ModalController }) => {
  const [selected, setSelected] = useState<number>(0);
  return (
    <Modal isOpen={modal.isOpen} close={modal.close} className={styles.wrapper}>
      <div className={styles.description}>
        There are some voting description here!
      </div>
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
          onClick={() => {}}
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
