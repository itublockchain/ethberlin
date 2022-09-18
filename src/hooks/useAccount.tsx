import { useSelector, useDispatch } from "react-redux";
import { setAccount } from "store/slicers/account";
export const useAccount = () => {
  const dispatch = useDispatch();
  const connectAccount = async () => {
    if (window.ethereum) {
      if (window.ethereum.selectedAddress === null) {
        console.log("connect account");
        let accounts = await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .catch((err: any) => {
            console.log(err.code);
          });
        console.log(accounts);
        dispatch(setAccount(accounts[0]));
      } else {
        dispatch(setAccount(window.ethereum.selectedAddress));
      }

      if (window.ethereum.chainId === "0x5") {
        let accounts = await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .catch((err: any) => {
            console.log(err.code);
          });
        setAccount(accounts[0]);
      } else {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x5" }],
          });
        } catch (e: any) {
          if (e.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x5",
                    chainName: "Goerli Test Network",
                    nativeCurrency: {
                      name: "Ether",
                      symbol: "ETH", // 2-6 characters long
                      decimals: 18,
                    },
                    blockExplorerUrls: ["https://goerli.etherscan.io/"],
                    rpcUrls: ["https://goerli.infura.io/v3/"],
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
            }
          }
        }
      }
    } else {
      console.log("Metamask ile ilgili bir problem var !!!");
    }
  };

  return { connectAccount };
};
