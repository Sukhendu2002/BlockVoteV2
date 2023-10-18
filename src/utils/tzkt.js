import axios from "axios";
export const fetchStorage = async (add) => {
  try {
    const response = await axios.get(
      `https://api.ghostnet.tzkt.io/v1/contracts/${add}/storage`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
