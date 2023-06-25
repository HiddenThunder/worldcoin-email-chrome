// TODO: make it bytes32
export type Hash = string;

export const getSignature = (hash: Hash) => `

_______________________________________________
<br>
✅ Verified w/ Worldcoin Email:
https://worldcoinemail.org/verify/${hash}
`;
