module.exports = (post) => {
  const {
    postId,
    title,
    content,
    category,
    subCategory,
    source,
    publishedAt,
    locations = [],
  } = post;

  const loc = locations.length ? locations[0] : {};
  const {
    address,
  } = loc;

  return {
    postId,
    title,
    content,
    category,
    subCategory: subCategory || 'n/a',
    source,
    locationAddress: address,
    locationDetails: loc,
    publishedAt: new Date(publishedAt).toISOString(),
  };
};
