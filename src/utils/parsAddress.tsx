import { utils } from "ethers";

export const parsAddress = (address: string) => {
  return (
    address?.substring?.(0, 6) +
    "..." +
    address?.substring?.(address?.length - 6)
  );
};

