const getPaiganation = (pge, lmt) => {
    const page = parseInt(pge);
    const limit = parseInt(lmt);

    if ((!limit || limit <= 0) && (!page || page <= 0)) {
        return { limit: 10, offset: 0 };
    }
    if (!page || page <= 0) {
        return { limit, offset: 0 };
    } else if (!limit || limit <= 0) {
        return { limit: 10, offset };
    }
    const offset = (page - 1) * limit;

    return { limit, offset };
};

module.exports = getPaiganation;
