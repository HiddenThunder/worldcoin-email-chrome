import { ethers } from "ethers";

import { debug } from "./logger";

export const calculateHash = (email: string) => {
  // hash email
  const hash = ethers.keccak256(ethers.toUtf8Bytes(email));

  debug("hash", hash);

  return hash;
};
