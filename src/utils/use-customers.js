import { useState, useEffect } from "react";

const useCustomers = (page, rowsPerPage, Data) => {
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (Data?.length > 0) {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const slicedData = Data.slice(startIndex, endIndex);
      setPaginatedUsers(slicedData);
      setTotalCount(Data.length);
    }
  }, [Data, page, rowsPerPage]);

  return { paginatedUsers, totalCount };
};

export default useCustomers;
