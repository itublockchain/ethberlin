import styles from "./ClaimModal.module.scss";
import { ModalController } from "hooks/useModal";
import { Modal, Button } from "ui";
import { Option } from "components";
import { useEffect, useState } from "react";
import { useClaim } from "hooks/useClaim";
import { useSelector } from "react-redux";
const ClaimModal = ({ modal }: { modal: ModalController }) => {
  const [selected, setSelected] = useState<number>(0);
  const [claimer, setClaimer] = useState<boolean>(false);
  const [isWhiteListed, setIsWhiteListed] = useState(true);
  const { claim, isClaimer } = useClaim();
  const account = useSelector((state: any) => state.account.account);
  const isWL = useSelector((state: any) => state.account.isWhiteListed);
  const voteModalDatas = useSelector(
    (state: any) => state.account.voteModalDatas
  );

  // useEffect(() => {
  //   const getRight = async () => {
  //     var data = await isClaimer();
  //     setClaimer(data);
  //   };
  //   getRight();
  // }, [account]);
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

      <div className={styles.warning}>
        {isWL
          ? "You have a vote token to claim!"
          : " you do not have the right to vote token!"}
      </div>

      <div className={styles.buttons}>
        {isWL ? (
          <Button
            className={styles.swap}
            color="black"
            width={"170px"}
            height="45px"
            fontWeight="fw800"
            onClick={() => {
              claim(voteModalDatas.index);
            }}
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
