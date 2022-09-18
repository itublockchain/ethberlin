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
import { useSelector } from "react-redux";
import { async } from "q";
enum WHICHMODAL {
  "CLAIM",
  "VOTE",
}

const MainPage = () => {
  const modal = useModal();
  const [whichModal, setWhichModal] = useState<WHICHMODAL>(WHICHMODAL.CLAIM);
  const [opening, setOpening] = useState(true);
  const { balanceOf } = useClaim();
  const voteModalDatas = useSelector(
    (state: any) => state.account.voteModalDatas
  );
  const account = useSelector(
    (state: any) => state.account.account
  );
  useEffect(() => {
    const fetchData = async () => {
      const result = await balanceOf(voteModalDatas.index);
      if (result) {
        setWhichModal(WHICHMODAL.VOTE);
      } else {
        setWhichModal(WHICHMODAL.CLAIM);
      }
    };

    fetchData().catch((err: any) => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await balanceOf(voteModalDatas.index);
      if (result) {
        setWhichModal(WHICHMODAL.VOTE);
      } else {
        setWhichModal(WHICHMODAL.CLAIM);
      }
    };

    fetchData().catch((err: any) => {
      console.log(err);
    });
  }, [account]);

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
