import axios from "axios";
import { toast } from "react-hot-toast";

export const POST = async (url, data) => {
  // const loading = toast.loading("Loading...");
  return await axios
    .post(url, data)
    .then((res) => {
      // toast.dismiss(loading);
      // toast.success(res.data.Message);
      return res;
    })
    .catch((err) => {
      // toast.dismiss(loading);
      // toast.error(err.message);
      throw err;
    });
};
