export const timeoutPromise = (url, setButtonActive) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      // reject(new Error('Timeout, Server is not responding'));
      reject({ error: "Timeout", message: "Server is not responding" });
      setButtonActive(true);
    }, 25 * 1000);
    url.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      },
    );
  });
};
