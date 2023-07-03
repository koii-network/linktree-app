import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { deleteLinktree, getLinktreeWithUsername } from "../api";
import { useWalletContext } from "../contexts";
import SingleLinktree from "../components/singleLinktree";
import { themeApplier } from "../helpers";
import "../css/ButtonAnimations.css";

function LinksComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isProfileOwner, setIsProfileOwner] = useState("");
  const [noProfileText, setNoProfileText] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const query = location.pathname.slice(1);
  const [userData, setUserData] = useState({});

  const { publicKey, apiUrl, nodeList } = useWalletContext();

  useEffect(() => {
    themeApplier(userData?.theme);
  }, [userData]); // Add userData as a dependency

  useEffect(() => {
    async function getUserData() {
      const userResponse = await getLinktreeWithUsername(query, nodeList);
      setUsername(query);
      const isProfileOwner =
        window?.k2 &&
        publicKey &&
        window?.k2?.publicKey?.toString() === userResponse.data.publicKey;
      setIsProfileOwner(isProfileOwner);
      setUserData(
        userResponse?.data?.linktree || userResponse?.data?.data?.linktree
      );
      return userResponse;
    }
    async function getData() {
      const userData = await getUserData();
      if (userData?.status) {
        setIsLoading(false);
      } else {
        toast({
          title: "Error fetching Linktree profile",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setNoProfileText("Error fetching Linktree profile");
      }
      if (userData.data && userData.status) {
        setNoProfileText("No Linktree profile for this Username");
      }
    }
    getData();
  }, [query, publicKey, toast, navigate, apiUrl, nodeList]);

  const handleDeleteLinktree = async () => {
    if (publicKey) {
      try {
        if (window?.k2) {
          await window.k2.signMessage("Delete Linktree");
        }
        const deletedProfile = await deleteLinktree(nodeList, publicKey);
        if (deletedProfile) {
          toast({
            title: "Linktree profile deleted successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          setTimeout(() => {
            navigate("/");
          }, 3000);
          return;
        }
        throw Error("Error deleting profile");
      } catch (error) {
        toast({
          title: "Error deleting Linktree profile",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  async function handleEditLinktree() {
    try {
      navigate(`/editLinktree/${username}`);
    } catch (error) {
      toast({
        title: "Error authorizing edit",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }
  return (
    <SingleLinktree
      isLoading={isLoading}
      isProfileOwner={isProfileOwner}
      userData={userData}
      handleDeleteLinktree={handleDeleteLinktree}
      handleEditLinktree={handleEditLinktree}
      publicKey={publicKey}
      noProfileText={noProfileText}
      username={username}
    />
  );
}

export default LinksComponent;
