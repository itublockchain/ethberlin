import { useSelector, useDispatch } from "react-redux";
import { setAccount, setIsWhiteListed } from "store/slicers/account";
import { RootState } from "store";
import { ethers } from "ethers";
import { ADDRESSES } from "constants/Addresses";
import { VoteTokenABI } from "constants/ABI";
import { MERKLE } from "constants/Merkle";

export const useClaim = () => {
  const dispatch = useDispatch();
  const account = useSelector((state: RootState) => state.account.account);
  const isWL = useSelector((state: RootState) => state.account.isWhiteListed);
  const claim = async (_index: number) => {
    if (account === null) {
      return;
    } else {
      const merkle: any = MERKLE as any;
      if (isWL) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          ADDRESSES.VoteTokenContracts[_index],
          VoteTokenABI,
          signer
        );

        // await contract.claim(merkle[account]);
        for (const key of Object.keys(MERKLE)) {
          if (key.toLowerCase() === account.toLowerCase()) {
            console.log(MERKLE[key]);
            await contract.claim(MERKLE[key]);
          }
        }
      }
    }
  };

  const isClaimer = async () => {
    const merkle: any = MERKLE as any;
    if (!account) {
      dispatch(setIsWhiteListed(false));
      return false;
    } else {
      for (const key of Object.keys(MERKLE)) {
        if (key.toLowerCase() === account.toLowerCase()) {
          dispatch(setIsWhiteListed(true));
          return true;
        }
      }
    }
  };

  const balanceOf = async (_index: number) => {
    if (account === null) {
      return;
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ADDRESSES.VoteTokenContracts[_index],
        VoteTokenABI,
        signer
      );

      const x = await contract.balanceOf(account);
      if (x._hex === "0x01") {
        return true;
      } else {
        return false;
      }
    }
  };

  return { claim, isClaimer, balanceOf };
};
