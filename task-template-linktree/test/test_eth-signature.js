const Wallet = require('ethereumjs-wallet').default;
const { default: axios } = require('axios');
const ethUtil = require('ethereumjs-util');
const { v4: uuidv4 } = require('uuid');
const bs58 = require('bs58');
const Web3 = require('web3');
const web3 = new Web3();

async function eth_sign() {
  // Generate a new Ethereum wallet
  const wallet = Wallet.generate();

  // Get the Ethereum address
  const eth_address = wallet.getAddressString();

  // Define your message
  const data = {
    uuid: '2c087463-b59c-4809-aeed-1cf5fb9e1e9e',
    linktree: {
      name: 'Saim Iqbal',
      description: 'Koii network',
      image:
        'https://bafybeifqlmydsok6qfg3vo33qsat4wswrjdneummyj7mc7w7sinziknriu.ipfs.w3s.link/Saim.jpg',
      background: '',
      links: [
        {
          key: 'telegram',
          label: 'Telegram',
          redirectUrl: 'https://t.me/saimkoii',
        },
        {
          key: 'twitter',
          label: 'Twitter',
          redirectUrl: 'https://twitter.com/s1mplecoder',
        },
        {
          key: 'instagram',
          label: 'Instagram',
          redirectUrl: 'https://www.instagram.com/saimiiqbal7/',
        },
        {
          key: 'official',
          label: 'Koii Network',
          redirectUrl: 'https://www.koii.network/',
        },
        {
          key: 'website',
          label: 'Koii Docs',
          redirectUrl: 'https://docs.koii.network/',
        },
      ],
    },
    timestamp: 1682951466329,
  };

  // Sign the message using the private key
  const message = JSON.stringify(data);
  const messageHash = web3.utils.keccak256(message);
  const signature = ethUtil.ecsign(
    ethUtil.toBuffer(messageHash),
    ethUtil.toBuffer(wallet.getPrivateKey()),
  );

  const signatureBuffer = Buffer.concat([
    ethUtil.toBuffer(signature.r),
    ethUtil.toBuffer(signature.s),
    ethUtil.toBuffer(signature.v),
  ]);
  const eth_signature = bs58.encode(signatureBuffer);

  // Create the payload
  const payload = {
    data,
    publicKey: '0xe5ebd1dffd8018cb41f31eb29d9dc4090f480eac',
    signature:
      '5eKb6iu4mv9MfYAuA8HTtWEdoQzZffq5gy8AAFyWzomvYoMk4VgHEoL1Mh7jyDtArjz3Gfdunx6XLxiK8X3bfZhdt',
  };

  console.log(payload);

  // await axios
  //   .post(
  //     'https://k2-tasknet-ports-3.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree',
  //     { payload },
  //   )
  //   .then(e => {
  //     if (e.status != 200) {
  //       console.log(e);
  //     }
  //     console.log(e.data);
  //   })
  //   .catch(e => {
  //     console.error(e);
  //   });

  // await axios
  //   .post(
  //     'https://k2-tasknet-ports-2.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree',
  //     { payload },
  //   )
  //   .then(e => {
  //     if (e.status != 200) {
  //       console.log(e);
  //     }
  //     console.log(e.data);
  //   })
  //   .catch(e => {
  //     console.error(e);
  //   });

  // await axios
  //   .post(
  //     'https://k2-tasknet-ports-1.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree',
  //     { payload },
  //   )
  //   .then(e => {
  //     if (e.status != 200) {
  //       console.log(e);
  //     }
  //     console.log(e.data);
  //   })
  //   .catch(e => {
  //     console.error(e);
  //   });

  await axios
    .post(
      'https://k2-tasknet.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree',
      { payload },
    )
    .then(e => {
      if (e.status != 200) {
        console.log(e);
      }
      console.log(e.data);
    })
    .catch(e => {
      console.error(e);
    });
}

eth_sign();
