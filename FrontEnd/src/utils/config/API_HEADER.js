export const API_HEADER = (token) => {
  return {
    headers: {
      ["Authorization"]: `${token}`,
    },
  };
};
