// magic.js
import { Magic } from "magic-sdk";

const magic = new Magic("pk_live_6B2081831F592E22", {
  network: {
    rpcUrl: "https://testnet.koii.live",
  },
});

export default magic;
