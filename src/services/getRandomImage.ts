export const getRandomImage = () => {
  const randomLock = Math.floor(Math.random() * 1000000);
  return `https://loremflickr.com/400/300?lock=${randomLock}`;
};
