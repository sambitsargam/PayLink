import React from "react";
import useBlockChain from "../hooks/useBlockChain";
import { providers, Contract, ethers, utils } from "ethers";
import { Typography, Grid, Link } from "@material-ui/core";

const WalletConnected = () => {
  const { connectedWallet } = useBlockChain();
  console.log(connectedWallet);

  return (
    <div>
      {" "}
      <Grid>
        {connectedWallet ? (
          <>
            <Typography
              variant="body1"
              align="center"
              gutterBottom
              component="div"
            >
              {`Metamask connected account: ${connectedWallet.substring(
                0,
                5
              )}...${connectedWallet.slice(-4)}`}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              gutterBottom
              component="div"
            >
              {" "}
              <Link
                href="https://explorer.sepolia.mantle.xyz/address/0x4f7D886c4aF691c054abdc907f3241085C474f3C"
                variant="body1"
                align="center"
                underline="hover"
                target="_blank"
              >
                Verified Contract on Mantle ✅
              </Link>
            </Typography>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </div>
  );
};

export default WalletConnected;
