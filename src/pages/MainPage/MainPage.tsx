import styles from "./MainPage.module.scss";
import {
  Navbar,
  AnimatedInfo,
  VoteTable,
  ClaimModal,
  VoteModal,
  Opening,
} from "components";
import { useModal } from "hooks/useModal";
import { useEffect, useState } from "react";
import { useClaim } from "hooks/useClaim";
import { useVoteContract } from "hooks/useVoteContract";

enum WHICHMODAL {
  "CLAIM",
  "VOTE",
}

const MainPage = () => {
  const modal = useModal();
  const [whichModal, setWhichModal] = useState<WHICHMODAL>(WHICHMODAL.CLAIM);
  const [opening, setOpening] = useState(true);
// const {balanceOf} = useVoteContract();
//   useEffect(()=> {},[])

  useEffect(() => {
    setTimeout(() => {
      setOpening(false);
    }, 5000);
  }, []);
  return (
    <>
      <div className={styles.wrapper}>
        {opening && <Opening />}
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
