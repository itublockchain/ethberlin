import styles from "./MainPage.module.scss";
import {
  Navbar,
  AnimatedInfo,
  VoteTable,
  ClaimModal,
  VoteModal,
} from "components";
import { useModal } from "hooks/useModal";
import { useState } from "react";

enum WHICHMODAL {
  "CLAIM",
  "VOTE",
}

const MainPage = () => {
  const modal = useModal();
  const [whichModal, setWhichModal] = useState<WHICHMODAL>(WHICHMODAL.CLAIM);
  return (
    <>
      <div className={styles.wrapper}>
        <Navbar />
        <AnimatedInfo />
        <VoteTable openModal={modal.open} />
        {whichModal === WHICHMODAL.CLAIM ? (
          <ClaimModal modal={modal} />
        ) : (
          <VoteModal modal={modal} />
        )}
      </div>
    </>
  );
};

export { MainPage };
