// TODO: make it bytes32
export type Hash = string;

export const getSignature = (hash: Hash) => `

___________________________________________________
<br>
☑️ Verified w/ Worldcoin Email:
<br>
https://worldcoinemail.org/verify/${hash}
<br>
<a href="https://worldcoinemail.org/api/downvote-email/${hash}" target="_blank">Unsubscribe</a>
&middot;
<a href="https://worldcoinemail.org/api/downvote-email/${hash}" target="_blank">Report</a>
<br>
`;

export const extractHashFromSignature = (body: string) => {
  const signature = getSignature("(.*)");
  const regex = new RegExp(signature, "g");
  const match = regex.exec(body);

  if (match) {
    return match[1];
  }

  return null;
};
