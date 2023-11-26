import { TezosToolkit } from "@taquito/taquito";
import { wallet } from "./wallet.js";
export const Tezos = new TezosToolkit("https://ghostnet.ecadinfra.com");
// TODO 3 - Specify wallet provider for Tezos instance
Tezos.setWalletProvider(wallet);
