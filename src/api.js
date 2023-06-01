import axios from "axios";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import bs58 from "bs58";
// import knode from "@_koi/sdk/node";

// const ktools = new knode.Node();

export async function getLinktrees() {
  try {
    const res = await axios.get("http://localhost:10000/linktree/list");
  } catch (error) {
    console.log(error);
  }
}

export async function getLinktree(publicKey) {
  try {
    const res = await axios.get(
      `http://localhost:10000/linktree/get/${publicKey}`
    );
    return res;
  } catch (error) {
    console.log(error);
  }
}

// export const handleSign = async (payload) => {
//   const jwk = await ktools.loadFile("arweaveWallet.json");
//   await ktools.loadWallet(jwk);

//   const signedPayload = await ktools.signPayload(payload);
//   const signature = signedPayload.signature;
//   return signature;
// };

export async function setLinktree(data, publicKey) {
  // const messageUint8Array = new Uint8Array(Buffer.from(JSON.stringify(data)));
  // const signature = await handleSign(messageUint8Array);
  const payload = {
    data,
    publicKey: bs58.encode(Buffer.from(publicKey)),
    signature: bs58.encode(Buffer.from("123456")),
  };
  console.log(payload);
  try {
    const res = await axios.post("http://localhost:10000/linktree", {
      payload,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
