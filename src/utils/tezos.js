import { TezosToolkit } from "@taquito/taquito";
import { wallet } from "./wallet";
export const Tezos = new TezosToolkit("https://ghostnet.smartpy.io");
// TODO 3 - Specify wallet provider for Tezos instance
Tezos.setWalletProvider(wallet);