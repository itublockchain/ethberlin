import { useSelector, useDispatch } from "react-redux";
import { setAccount } from "store/slicers/account";
import { RootState } from "store";
import { ethers } from "ethers";
import { ADDRESSES } from "constants/Addresses";
import { VoteContractABI, TakeContractABI } from "constants/ABI";
import { setVoteDatas } from "store/slicers/account";

export const useVoteContract = () => {
  const dispatch = useDispatch();
  const account = useSelector((state: RootState) => state.account.account);
  const voteModalDatas = useSelector(
    (state: RootState) => state.account.voteModalDatas
  );

  const voteElection = async (_id: number, _to: number) => {
    if (account === null) {
      return;
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ADDRESSES.VoteTokenContracts[_id],
        VoteContractABI,
        signer
      );
      await contract.voteElection(_id, _to);
    }
  };

  const getElections = async () => {
    if (account === null) {
      return;
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ADDRESSES.VoteContract,
        VoteContractABI,
        signer
      );

      const datas = await contract.elections();
      dispatch(setVoteDatas(datas));
    }
  };

  const sendToken = async () => {
    if (account === null) {
      return;
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ADDRESSES.takeContract,
        TakeContractABI,
        signer
      );

      await contract.takeToken(
        ADDRESSES.VoteTokenContracts[voteModalDatas.index],
        1
      );
    }
  };

  return { voteElection, getElections, sendToken };
};
