import { client } from "../../../lib/sanity";

const createUserInSanity = async (req, res, next) => {
  // console.log(req.body);
  if (req.method === "POST") {
    try {
      const userDoc = {
        _id: req.body.userWalletAddress,
        _type: "users",
        name: req.body.name,
        walletAddress: req.body.userWalletAddress,
      };

      await client.createIfNotExists(userDoc);

      res.status(200).send({ message: "success" });
    } catch (error) {
      res.status(500).send({ message: "error", data: error.message });
    }
  }
};

export default createUserInSanity;
