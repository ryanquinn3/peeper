const print = (...args) => {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toDateString();
  console.log(`[${date} ${time}] `, ...args);
};

module.exports.print = print;
