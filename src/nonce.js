
let counter = 0;
let last    = null;

export default () => {
  let now = parseInt(Date.now()) * 1000;

  if (now !== last)
    counter = 0;

  if (counter < 999)
    counter++;

  return (last = now) + counter;
};
