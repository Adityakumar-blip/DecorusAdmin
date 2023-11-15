import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const CommonContext = createContext({ isLoading: false, setIsLoading: () => {} });
export const CommonProvider = (props) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <CommonContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

CommonProvider.propTypes = {
  children: PropTypes.node,
};

export const CommonConsumer = CommonContext.Consumer;

export const useCommonContext = () => useContext(CommonContext);
