import styles from "./VoteModal.module.scss";
import { ModalController } from "hooks/useModal";
import { Modal, Button } from "ui";
import { Option } from "components";
import { useState } from "react";
import { useVoteContract } from "hooks/useVoteContract";
import { useSelector } from "react-redux";
import { Spinner } from "ui/Spinner/Spinner";

const VoteModal = ({ modal }: { modal: ModalController }) => {
  const [selected, setSelected] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [privacyMsg, setPrivacyMsg] = useState<string>("");

  const { voteElection } = useVoteContract();
  const voteModalDatas = useSelector(
    (state: any) => state.account.voteModalDatas
  );

  const onGetPrivacy = () => {
    const endLoading = (msg: string) => () => {
      setLoading(false);
      setPrivacyMsg(msg);
    };

    setLoading(true);
    setTimeout(endLoading("0xDEADBEEF"), 3000);
  };

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
        {loading ? (
          <Spinner />
        ) : (
          <Button
            className={styles.swap}
            color="black"
            width={"170px"}
            height="45px"
            fontWeight="fw800"
            disabled={privacyMsg !== ""}
            onClick={onGetPrivacy}
          >
            Get Privacy
          </Button>
        )}
        <p>{privacyMsg}</p> 
      </div>
    </Modal>
  );
};

export { VoteModal };
