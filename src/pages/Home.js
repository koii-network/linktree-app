import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useWalletContext } from "../contexts";
import { useK2Finnie } from "../hooks";
import { DOWNLOAD_FINNIE_URL } from "../config";
import { allLinktrees, getLinktree } from "../api";
import { animatedSection } from "../helpers/animations";
import HomeComponent from "../components/home";

const HomePage = () => {
  //Force dark theme by default
  document.documentElement.setAttribute("data-theme", "light");
  const navigate = useNavigate();
  const toast = useToast();
  const { setPublicKey, nodeList, setIsFinnieDetected, isFinnieDetected } =
    useWalletContext();
  const { connect } = useK2Finnie({ setIsFinnieDetected });
  const [total, setTotal] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    function handleResize() {
      if (document.documentElement.clientWidth < 700) {
        setIsMobile(false);
      } else {
        setIsMobile(false);
      }
    }
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleConnectFinnie = async () => {
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
  };

  const linkToGetFinnie = (
    <a rel='noreferrer' target='_blank' href={DOWNLOAD_FINNIE_URL}>
      Get Finnie
    </a>
  );

  const connectButtonText = isFinnieDetected
    ? "Connect Finnie"
    : linkToGetFinnie;

  return (
    <HomeComponent
      isMobile={isMobile}
      handleConnectFinnie={handleConnectFinnie}
      connectButtonText={connectButtonText}
      total={total}
    />
  );
};

export default HomePage;
