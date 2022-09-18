import styles from "./VoteModal.module.scss";
import { ModalController } from "hooks/useModal";
import { Modal, Button } from "ui";
import { Option } from "components";
import { useState } from "react";
import { useVoteContract } from "hooks/useVoteContract";
import { useSelector } from "react-redux";
import { Spinner } from "ui/Spinner/Spinner";

const MOCK_PROOF =
  "0x1a743d773383b9ee57e11105b3a19c992c17095ccbb2d4b107248eeb17f433f30ebf6e33704c878decb41d4871710bd85ec28f77056df40a4d648a69c7d7";
enum WHICHMODAL {
  "CLAIM",
  "VOTE",
}
const VoteModal = ({
  modal,
  changer,
}: {
  modal: ModalController;
  changer: any;
}) => {
  const [selected, setSelected] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [privacyMsg, setPrivacyMsg] = useState<string>("");

  const { voteElection, sendToken } = useVoteContract();
  const voteModalDatas = useSelector(
    (state: any) => state.account.voteModalDatas
  );

  const onGetPrivacy = () => {
    const endLoading = (msg: string) => () => {
      setLoading(false);
      setPrivacyMsg(msg);
    };

    setTimeout(changer(WHICHMODAL.CLAIM), 10000);
    setLoading(true);
    setTimeout(endLoading(MOCK_PROOF), 8000);
  };

  return (
    <Modal isOpen={modal.isOpen} close={modal.close} className={styles.wrapper}>
      <div className={styles.description}>{voteModalDatas.description}</div>
      <div className={styles.candidates}>
        {voteModalDatas.options.map((data: any, i: number) => {
          return (
            <Option
              key={i}
              info={data}
              index={i}
              selected={selected}
              setSelected={setSelected}
            />
          );
        })}
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
            voteElection(voteModalDatas.index, selected); // update params
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
            onClick={() => {
              onGetPrivacy();
              // sendToken();
            }}
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
