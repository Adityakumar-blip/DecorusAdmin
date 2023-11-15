import { toast } from "react-hot-toast";

export const errorLoading = (err) => {
  toast.error(
    "An error has occured",
    "Please refresh the page. Otherwise, it will refresh automatically in 10 seconds."
  );
  setTimeout(() => window.location.reload(), 10000);
};
