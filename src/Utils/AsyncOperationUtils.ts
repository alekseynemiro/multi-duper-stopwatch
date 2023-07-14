export const when = (predicate: () => boolean): Promise<void> => {
  const promise = new Promise<void>((resolve): void => {
    const interval = setInterval(
      (): void => {
        if (predicate()) {
          resolve();
          clearInterval(interval);
        }
      },
      250
    );
  });

  return promise;
};
