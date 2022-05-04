const Wallet = artifacts.require("Wallet");
const ethers = require("../frontend/node_modules/ethers");

let wallet = null;

before(async () => {
  wallet = await Wallet.deployed();
});

contract("Wallet", (accounts) => {
  it("TestContract balance should starts with 0 ETH", async () => {
    let balance = await web3.eth.getBalance(wallet.address);
    assert.equal(balance, 0);
  });
  it("TestContract balance should has 1 ETH after deposit", async () => {
    let one_eth = web3.utils.toWei("1", "ether");

    const signer = new ethers.providers.Web3Provider(
      web3.currentProvider
    ).getSigner();

    const tx = await signer.sendTransaction({
      to: wallet.address,
      value: web3.utils.toHex(one_eth),
    });

    try {
      await tx.wait().then(async (data) => {
        let balance = await wallet.getUnderlyingEthBalance.call();
        const balance_ether = Math.round(
          ethers.utils.formatEther(balance.toString())
        );
        assert.equal(1, balance_ether);
      });
      return;
    } catch (error) {
      assert(false);
    }
  });
});
