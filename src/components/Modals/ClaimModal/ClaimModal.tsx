import styles from "./ClaimModal.module.scss";
import { ModalController } from "hooks/useModal";
import { Modal, Button } from "ui";
import { Option } from "components";
import { useState } from "react";
const ClaimModal = ({ modal }: { modal: ModalController }) => {
  const [selected, setSelected] = useState<number>(0);
  const [isWhiteListed, setIsWhiteListed] = useState(false);
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
        {isWhiteListed ? (
          <Button
            className={styles.swap}
            color="black"
            width={"170px"}
            height="45px"
            fontWeight="fw800"
            onClick={() => {}}
          >
            Claim
          </Button>
        ) : (
          <Button
            className={styles.swap}
            color="black"
            width={"170px"}
            height="45px"
            fontWeight="fw800"
            onClick={() => {}}
          >
            Claim By Proof
          </Button>
        )}
      </div>
      {!isWhiteListed && (
        <div className={styles.input}>
          <input
            placeholder="Please enter your proof!"
            className={styles.inputTag}
          ></input>
        </div>
      )}
    </Modal>
  );
};

export { ClaimModal };
