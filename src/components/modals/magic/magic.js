import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";

const magic = new Magic("pk_live_CBCF36F8BBB76143", {
  extensions: [
    new SolanaExtension({
      rpcUrl: "https://testnet.koii.live",
    }),
  ],
});

export default magic;
