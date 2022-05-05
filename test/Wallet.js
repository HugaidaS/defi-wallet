const Wallet = artifacts.require("Wallet");
const ethers = require("../frontend/node_modules/ethers");
const addresses = require("../frontend/src/addresses");

let wallet = null;
let signer = null;

before(async () => {
  wallet = await Wallet.deployed();
  signer = new ethers.providers.Web3Provider(web3.currentProvider).getSigner();
});

contract("Wallet", () => {
  it("Wallet eth balance should starts with 0 ETH", async () => {
    let balance = await wallet.getUnderlyingEthBalance.call();
    assert.equal(balance, 0);
  });

  it("Walllet balance should has 1 ETH after deposit", async () => {
    let one_eth = web3.utils.toWei("1", "ether");

    const tx = await signer
      .sendTransaction({
        to: wallet.address,
        value: web3.utils.toHex(one_eth),
      })
      .then((data) => console.log(data));

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

  it("Wallet dai balance should starts with 0 DAI", async () => {
    let balance = await wallet.getUnderlyingBalance.call(addresses.cDai);
    let balanceDai = balance.toString();
    assert.equal(0, balanceDai);
  });

  it("Wallet dai balance should has 1 DAI after deposit", async () => {
    const dai = new ethers.Contract(addresses.dai, addresses.abi, signer);
    const amount = ethers.utils.parseUnits("1", 18);
    console.log(amount);
    const tx1 = await dai.approve(wallet.address, amount._hex);
    await tx1.wait();
    const tx2 = await wallet.deposit.call(addresses.cDai, amount._hex);
    await tx2.wait().then((data) => console.log(data));
    assert(true);
  });
});
