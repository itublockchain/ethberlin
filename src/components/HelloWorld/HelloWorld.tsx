import styles from "./HelloWorld.module.scss";
import { ethers } from "ethers";
// import { ABI } from "Constants/ABI";
// import { ADDRESSES } from "Constants/Addresses";
import { useEffect } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const HelloWorld = () => {
  var provider;

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
        })
        .then((result: any) => {
          console.log(result)
          // The result varies by RPC method.
          // For example, this method will return a transaction hash hexadecimal string on success.
        })
        .catch((error: any) => {
          // If the request fails, the Promise will reject with an error.
        });
    }
  }, []);
  return (
    <>
      <div className={styles.wrapper}>Hello Viridis</div>
    </>
  );
};

export { HelloWorld };
