export const sleep = (ms: number) => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
