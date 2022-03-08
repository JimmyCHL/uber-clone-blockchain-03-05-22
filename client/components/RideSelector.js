import React, { useEffect, useState, useContext } from "react";
import uberX from "../assets/uberX.png";
import uberBlack from "../assets/uberBlack.png";
import uberBlackSuv from "../assets/uberBlackSuv.png";
import uberSelect from "../assets/uberSelect.png";
import uberXL from "../assets/uberXL.png";
import ethLogo from "../assets/eth-logo.png";
import Image from "next/image";
import { UberContext } from "../context/uberContext";

const style = {
  wrapper: `h-full flex flex-col`,
  title: `text-gray-500 text-center text-xs py-2 border-b`,
  carList: `flex flex-col flex-1 overflow-auto`,
  car: `flex p-3 items-center border-2 border-white cursor-pointer`,
  selectedCar: `border-2 border-black flex p-3 m-2 items-center cursor-pointer`,
  //   carImage: `h-14`,
  carDetails: `ml-2 flex-1`,
  service: `font-medium`,
  time: `text-xs text-blue-500`,
  priceContainer: `flex items-center`,
  price: `mr-[-0.8rem]`,
};

// const carList = [
//   {
//     service: "UberX",
//     iconUrl: uberX,
//     priceMultiplier: 1,
//   },
//   {
//     service: "UberBlack",
//     iconUrl: uberBlack,
//     priceMultiplier: 1.5,
//   },
//   {
//     service: "UberBlackSuv",
//     iconUrl: uberBlackSuv,
//     priceMultiplier: 1.5,
//   },
//   {
//     service: "UberSelect",
//     iconUrl: uberSelect,
//     priceMultiplier: 1.5,
//   },
//   {
//     service: "UberXL",
//     iconUrl: uberXL,
//     priceMultiplier: 1.5,
//   },
// ];

// const basePrice = 1542;

const RideSelector = () => {
  const [carList, setCarList] = useState([]);
  const { selectedRide, setSelectedRide, setPrice, basePrice } =
    useContext(UberContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/db/getRideTypes");
        const data = await response.json();
        // console.log(data.data);
        setCarList(data.data);
        setSelectedRide(data.data[0]);
        setPrice(
          ((basePrice / 10 ** 5) * data.data[0].priceMultiplier).toFixed(5)
        );
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Choose a ride, or swipe up for more</div>
      <div className={style.carList}>
        {carList.map((car, index) => (
          <div
            className={`${
              selectedRide.service === car.service
                ? style.selectedCar
                : style.car
            }`}
            key={index}
            onClick={(e) => {
              setSelectedRide(car);
              setPrice(
                ((basePrice / 10 ** 5) * car.priceMultiplier).toFixed(5)
              );
            }}
          >
            <Image
              src={car.iconUrl}
              className={style.carImage}
              height={50}
              width={50}
            />
            <div className={style.carDetails}>
              <div className={style.service}>{car.service}</div>
              <div className={style.time}>5 min away</div>
            </div>
            <div className={style.priceContainer}>
              <div className={style.price}>
                {((basePrice / 10 ** 5) * car.priceMultiplier).toFixed(5)}
              </div>
              <Image src={ethLogo} height={25} width={40} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideSelector;
