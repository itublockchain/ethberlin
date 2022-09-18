import { utils } from "ethers";

export const parseAddress = (address: string) => {
  return (
    address?.substring?.(0, 5) +
    "..." +
    address?.substring?.(address?.length - 5)
  );
};

export const parseAddressMobile = (address: string) => {
  return (
    address?.substring?.(0, 3) +
    "..." +
    address?.substring?.(address?.length - 2)
  );
};
