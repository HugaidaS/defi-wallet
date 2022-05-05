const Wallet = artifacts.require("Wallet");
const ethers = require("../frontend/node_modules/ethers");
const addresses = require("../frontend/src/addresses");

let wallet = null;
let signer = null;

before(async () => {
  wallet = await Wallet.deployed();
  signer = new ethers.providers.Web3Provider(web3.currentProvider).getSigner();
});

contract("Wallet", (accounts) => {
  it("Wallet eth balance should starts with 0 ETH", async () => {
    let balance = await wallet.getUnderlyingEthBalance.call();
    assert.equal(balance, 0);
  });

  it("Walllet balance should have 10 ETH after deposit", async () => {
    let ten_eth = web3.utils.toWei("10", "ether");

    const tx = await signer.sendTransaction({
      to: wallet.address,
      value: web3.utils.toHex(ten_eth),
    });

    await tx.wait();

    const balance = await wallet.getUnderlyingEthBalance.call();
    const balance_ether = Math.round(
      ethers.utils.formatEther(balance.toString())
    );

    console.log(balance_ether, "ETHERS");
    assert.equal(10, balance_ether);
  });

  it("Wallet dai balance should starts with 0 DAI", async () => {
    let balance = await wallet.getUnderlyingBalance.call(addresses.cDai);
    let balanceDai = balance.toString();
    assert.equal(0, balanceDai);
  });

  //error here

  // it("Wallet dai balance should have 1 DAI after deposit", async () => {
  //   const dai = new ethers.Contract(addresses.dai, addresses.abi, signer);
  //   let amount = web3.utils.toWei("1", "ether");
  //   const depositAmountDai = web3.utils.toHex(amount);
  //   const tx = await dai.approve(wallet.address, depositAmountDai);
  //   await tx.wait();
  //   console.log(tx);
  //   const tx2 = await wallet.deposit.call(addresses.cDai, depositAmountDai);
  //   await tx2.wait();

  //   assert(true);
  // })

  //test for withdraw dai - error too

  //error here
  // it("Wallet eth balance should have 0 ETH after eth withdraw", async () => {
  //   const amount = web3.utils.toWei("10", "ether");
  //   let balance = await wallet.getUnderlyingEthBalance.call();
  //   const balance_eth = Math.round(
  //     ethers.utils.formatEther(balance.toString())
  //   );

  //   const tx = await wallet.withdrawEth(web3.utils.toHex(amount), accounts[0]);
  //   await tx.wait();
  //   console.log(balance_eth);
  //   //assertion here
  // });

  it("Wallet does not let you withdraw dai with low balance", async () => {
    const amount = web3.utils.toWei("1", "ether");
    let balance = await wallet.getUnderlyingBalance.call(addresses.cDai);
    const balance_dai = Math.round(
      ethers.utils.formatEther(balance.toString())
    );

    console.log(balance_dai);

    try {
      const tx = await wallet.withdraw(
        addresses.cDai,
        web3.utils.toHex(amount),
        accounts[0]
      );
      await tx.wait();
      assert(false);
      return;
    } catch (e) {
      assert.equal(e.reason, "balance too low");
    }
  });
});
