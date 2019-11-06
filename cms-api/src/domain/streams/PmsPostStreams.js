module.exports = (post) => {
  const {
    postId,
    title,
    content,
    category,
    subCategory,
    source,
    locationAddress,
    locationDetails,
    publishedAt,
  } = post;

  return {
    postId,
    title,
    content,
    category,
    subCategory: subCategory || 'n/a',
    source,
    locationAddress,
    locationDetails,
    publishedAt: new Date(publishedAt).toISOString(),
  };
};
