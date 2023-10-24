type ParamsType = {
  loadAction: any;
};

export const activateRoute = async ({ loadAction }: ParamsType) => {
  try {
    await loadAction();
  } catch (error) {
    console.error('error in routerPrefetcher', error);
  }
};
