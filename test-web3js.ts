import Web3 from 'web3';

const web3 = new Web3(
  'https://goerli.infura.io/v3/aac6886e109048d79f366cb36678d650',
);

function main() {
  // console.log(web3.eth.personal);
  // web3.eth
  //   .getBalance('0x6aeECc624BC7884111c8563B26eE700d78f6AC02')
  //   .then((balance) => {
  //     let balanceETH = web3.utils.fromWei(balance, 'ether');
  //     console.log(`balance = ${balanceETH} ETH`);
  //   });
  //
  // const from = '0xA296148501a2279b25eeAE7BfBAD04Fe0121aEb6';
  // const to = '0xDf2EB8a45Ca2AD0Ac0193ea3b655AEEbcD6Ac98e';
  // const amount = 1;
  // sendMoney(from, to, amount);
}

function checkBalance(address: string) {
  web3.eth.getBalance(address).then((balance) => {
    let balanceETH = web3.utils.fromWei(balance, 'ether');
    console.log(`balance = ${balanceETH} ETH`);
  });
}

function sendMoney(from: string, to: string, amount: number) {
  web3.eth
    .sendTransaction({
      from: from,
      to: to,
      value: web3.utils.toWei(amount, 'ether'),
    })
    .then((receipt) => console.log('receipt', receipt))
    .catch((err) => console.log('error', err));
}

function test() {
  const account = web3.eth.accounts.create();
  console.log({ account });
}

// console.log(web3.utils.randomHex(32));
// main();
checkBalance('0x67b007fE8143c2176b6ae34DDcB62812373740D9');
// 0x67b007fE8143c2176b6ae34DDcB62812373740D9
// 0x67b007fE8143c2176b6ae34DDcB62812373740D9
