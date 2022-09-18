import { useSelector, useDispatch } from "react-redux";
import { setAccount } from "store/slicers/account";
import { RootState } from "store";
import { ethers } from "ethers";
import { ADDRESSES } from "constants/Addresses";
import { VoteContractABI } from "constants/ABI";
import { setVoteDatas } from "store/slicers/account";

export const useVoteContract = () => {
  const dispatch = useDispatch();
  const account = useSelector((state: RootState) => state.account.account);

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

  return { voteElection, getElections };
};
