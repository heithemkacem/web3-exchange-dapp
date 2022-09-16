import Moralis from "moralis";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./user.module.css";
export function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function fixUrl(url) {
  // if url is of type undefined

  if (url.startsWith("ipfs")) {
    return (
      "https://ipfs.moralis.io:2053/ipfs/ " +
      url.split("ipfs://ipfs/").slice(-1)[0]
    );
  } else if (url.startsWith("https://ipfs.moralis.io:2053/ipfs/")) {
    return url;
  } else {
    return url;
  }
}

export function fixURL2(url) {
  if (url.startsWith("ipfs")) {
    return (
      "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(-1)[0]
    );
  } else if (url.startsWith("https://ipfs.moralis.io:2053/ipfs/")) {
    return url;
  } else {
    return url;
  }
}

function User({ user, nativeBalance, tokens, nfts }) {
  const [userNfts, setNfts] = useState([]);
  useEffect(() => {
    {
      nfts.forEach((element) => {
        if (element.tokenUri !== undefined) {
          let url = fixUrl(element.tokenUri);
          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              let url2 = fixURL2(data.image);
              setNfts((userNfts) => [...userNfts, url2]);
            });
        }
      });
    }
  }, []);

  return (
    <>
      <div>
        <img
          src={`https://avatars.dicebear.com/api/bottts/${user.address}.svg`}
          height={100}
          width={100}
        />
        <pre className={styles.whiteText}>{JSON.stringify(user, null, 2)}</pre>
        <pre className={styles.whiteText}>
          {JSON.stringify(nativeBalance, null, 2)}
        </pre>
        <pre className={styles.whiteText}>
          {JSON.stringify(tokens, null, 2)}
        </pre>

        {[...new Set(userNfts)].map((nft) => (
          //if a string end with .mp4 then it is a video,
          //else it is an image
          <div>
            {nft.endsWith(".mp4") ? (
              <video key={makeid(10)} width="320" height="240" controls>
                <source src={nft} type="video/mp4" />
              </video>
            ) : (
              <img
                key={makeid(10)}
                src={nft}
                alt="nft"
                width="320"
                height="240"
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  //if user not logged in, redirect to home page

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const { EvmChain } = require("@moralisweb3/evm-utils");
    const chain = EvmChain.ETHEREUM;
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    const address = session.user.address;
    //Get Native Balance
    const nativeBalance = await Moralis.EvmApi.account.getNativeBalance({
      address,
    });
    //Get Tokens
    const tokenBalances = await Moralis.EvmApi.account.getTokenBalances({
      address,
      chain,
    });
    const tokens = tokenBalances.result.map((token) => token.display());
    //Get Nfts
    const nftsBalances = await Moralis.EvmApi.account.getNFTs({
      address,
      chain,
      limit: 10,
    });

    return {
      props: {
        nfts: JSON.parse(JSON.stringify(nftsBalances)),
        user: session.user,
        nativeBalance: nativeBalance.result.balance.ether,
        tokens,
      },
    };
  }
}
export default User;
