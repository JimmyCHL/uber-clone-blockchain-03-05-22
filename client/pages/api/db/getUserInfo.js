import { client } from "../../../lib/sanity";

const getUserInfo = async (req, res, next) => {
  const query = `
        *[_type == "users" && walletAddress=="${req.query.walletAddress}"]{
            name,
            walletAddress,
            "imageUrl":profileImage.asset->url
        }
    `;

  try {
    const sanityResponse = await client.fetch(query);
    // console.log(sanityResponse);
    res.status(200).send({ message: "success", data: sanityResponse[0] });
  } catch (error) {
    res.status(500).send({ message: "error", data: error.message });
  }
};

export default getUserInfo;
