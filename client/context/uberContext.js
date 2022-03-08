import { createContext, useState, useEffect } from "react";
import { faker } from "@faker-js/faker";

export const UberContext = createContext();

export const UberProvider = ({ children }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState("");
  const [dropoffCoordinates, setDropoffCoordinates] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [selectedRide, setSelectedRide] = useState({});
  const [price, setPrice] = useState("");
  const [basePrice, setBasePrice] = useState(0);

  let metamask;

  if (typeof window !== "undefined") {
    metamask = window.ethereum;
  }

  // useEffect for check if wallet is connected
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // useEffect for when should you fetch user info
  useEffect(() => {
    if (!currentAccount) return;
    requestToGetCurrentUserInfo(currentAccount);
  }, [currentAccount]);

  //getDuration
  useEffect(() => {
    if (!pickupCoordinates || !dropoffCoordinates) return;
    (async () => {
      try {
        const response = await fetch("/api/map/getDuration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pickupCoordinates: `${pickupCoordinates[0]},${pickupCoordinates[1]}`,
            dropoffCoordinates: `${dropoffCoordinates[0]},${dropoffCoordinates[1]}`,
          }),
        });

        const data = await response.json();
        setBasePrice(Math.round(await data.data));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [pickupCoordinates, dropoffCoordinates]);

  //check if wallet connected
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return;

    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0]);
        requestToCreateUserOnSanity(addressArray[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return;
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0]);
        requestToCreateUserOnSanity(addressArray[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createLocationCoordinatePromise = (locationName, locationType) => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch("api/map/getLocationCoordinates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: locationName }),
      });

      const data = await response.json();

      if ((data.message = "success")) {
        switch (locationType) {
          case "pickup":
            setPickupCoordinates(data.data);
            break;
          case "dropoff":
            setDropoffCoordinates(data.data);
            break;
        }
        resolve();
      } else {
        reject();
      }
    });
  };

  useEffect(() => {
    if (pickup && dropoff) {
      (async () => {
        await Promise.all([
          createLocationCoordinatePromise(pickup, "pickup"),
          createLocationCoordinatePromise(dropoff, "dropoff"),
        ]);
      })();
    } else return;
  }, [pickup, dropoff]);

  const requestToCreateUserOnSanity = async (address) => {
    if (!window.ethereum) return;

    try {
      await fetch("/api/db/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userWalletAddress: address,
          name: faker.name.findName(),
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const requestToGetCurrentUserInfo = async (walletAddress) => {
    try {
      const response = await fetch(
        `api/db/getUserInfo?walletAddress=${walletAddress}`
      );
      const data = await response.json();
      // console.log(data);
      setCurrentUser(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UberContext.Provider
      value={{
        pickup,
        dropoff,
        setPickup,
        setDropoff,
        pickupCoordinates,
        dropoffCoordinates,
        connectWallet,
        currentAccount,
        currentUser,
        selectedRide,
        price,
        setPrice,
        setSelectedRide,
        basePrice,
        metamask,
      }}
    >
      {children}
    </UberContext.Provider>
  );
};
