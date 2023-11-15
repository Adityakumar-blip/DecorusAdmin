import { useMemo } from "react";

const useCustomerIds = (customers) => {
  const customerIds = useMemo(() => {
    if (Array.isArray(customers)) {
      return customers.map((customer) => customer.uid);
    }
    return [];
  }, [customers]);

  return customerIds;
};

export default useCustomerIds;
