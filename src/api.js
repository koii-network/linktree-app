import axios from "axios";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import bs58 from "bs58";
// import knode from "@_koi/sdk/node";

// const ktools = new knode.Node();

export async function getLinktrees(publicKey) {
  try {
    const res = await axios.get("http://localhost:10000/linktree/list");
    const profile = res.data.filter((item) => {
      return item.publicKey === publicKey;
    });
    return {
      data: profile[0],
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      data: "",
      status: true,
    };
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

export async function setLinktree(data, publicKey) {
  const messageString = JSON.stringify(data);
  const signatureRaw = await window.k2.signMessage(messageString);
  const payload = {
    data,
    publicKey: publicKey,
    signature: bs58.encode(signatureRaw.signature),
  };
  const authdata = {
    pubkey: publicKey,
  };
  try {
    const res = await axios.post("http://localhost:10000/linktree", {
      payload,
    });
    await axios.post("http://localhost:10000/authlist", {
      authdata,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAuthList(publicKey) {
  try {
    const res = await axios.get(
      `http://localhost:10000/authlist/get/${publicKey}`
    );
    return false;
  } catch (error) {
    console.log(error);
  }
}
