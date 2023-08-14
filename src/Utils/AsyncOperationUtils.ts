export const when = (predicate: () => boolean, timeout: number = 250): Promise<void> => {
  const promise = new Promise<void>((resolve): void => {
    const interval = setInterval(
      (): void => {
        if (predicate()) {
          resolve();
          clearInterval(interval);
        }
      },
      timeout
    );
  });

  return promise;
};
