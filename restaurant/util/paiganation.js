const getPaiganation = (pge, lmt) => {
  let page = parseInt(pge, 10);
  let limit = parseInt(lmt, 10);

  if ((!limit || limit <= 0) && (!page || page <= 0)) {
    return { limit: 10, offset: 0 };
  }
  if (!page || page <= 0) {
    page = 0;
  }
  if (!limit || limit <= 0) {
    limit = 10;
  }
  const offset = (page - 1) * limit;

  return { limit, offset };
};

module.exports = getPaiganation;
