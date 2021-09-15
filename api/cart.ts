import axios from "axios";

const VerifyCarts = async () => {
  try {
    const res = await axios.post("/quotes/verify");
    return res.data;
  } catch (e) {
    throw e;
  }
};
const UpdateCart = async (request) => {
  try {
    const res = await axios.put("/quotes/cart", request);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export { VerifyCarts, UpdateCart };
