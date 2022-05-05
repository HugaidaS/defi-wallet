import { ethers, Contract } from "ethers";
import Wallet from "./contracts/Wallet.json";
const addresses = require("./addresses");

const { ethereum } = window;

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        await ethereum.request({
          method: "eth_requestAccounts",
        });
        const signer = provider.getSigner();

        const wallet = new Contract(
          Wallet.networks[window.ethereum.networkVersion].address,
          Wallet.abi,
          signer
        );

        const dai = new Contract(addresses.dai, addresses.abi, signer);

        resolve({ signer, wallet, dai });
      }
      resolve({ signer: undefined, wallet: undefined, dai: undefined });
    });
  });

export default getBlockchain;
