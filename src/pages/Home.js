import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { Oval } from "react-loader-spinner";
import { useWalletContext } from "../contexts";
import { useK2Finnie } from "../hooks";
import { DOWNLOAD_FINNIE_URL } from "../config";
import { allLinktrees, getLinktree } from "../api";
import { animatedSection } from "../helpers/animations";
import HomeComponent from "../components/home";

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setPublicKey, nodeList, setIsFinnieDetected, isFinnieDetected } =
    useWalletContext();
  const { connect } = useK2Finnie({ setIsFinnieDetected });
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Force light theme by default
  document.documentElement.setAttribute("data-theme", "light");

  useEffect(() => {
    animatedSection();
    allLinktrees(nodeList)
      .then((number) => {
        setTotal(number);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [nodeList]);

  const handleConnectFinnie = async () => {
    setIsLoading(true);
    if (isFinnieDetected) {
      const pubKey = await connect();
      try {
        if (pubKey) {
          setPublicKey(pubKey);

          const linktree = await getLinktree(pubKey, nodeList);
          const username =
            linktree?.data?.data?.linktree?.linktreeAddress ||
            linktree?.data?.linktree?.linktreeAddress;
          if (linktree.status === true && !linktree?.data) {
            setTimeout(() => {
              navigate("/createlinktree");
            }, 2000);
          } else if (linktree.data && username) {
            toast({
              title: "Linktree profile successfully fetched!",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            setTimeout(() => {
              navigate(`/${username}`);
            }, 3000);
          } else {
            toast({
              title: "Error fetching Linktree data",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
          }
        }
      } catch (err) {
        toast({
          title: "Error fetching Linktree data",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
    setIsLoading(false);
  };

  const linkToGetFinnie = (
    <a rel='noreferrer' target='_blank' href={DOWNLOAD_FINNIE_URL}>
      Get Finnie
    </a>
  );

  const connectButtonText = isFinnieDetected ? (
    isLoading ? (
      <Oval
        height={16}
        width={16}
        color='#6B5FA5'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor='#6B5FA5'
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    ) : (
      "Connect Finnie"
    )
  ) : (
    linkToGetFinnie
  );

  return (
    <HomeComponent
      handleConnectFinnie={handleConnectFinnie}
      connectButtonText={connectButtonText}
      total={total}
    />
  );
};

export default HomePage;
