module.exports = (post) => {
  const {
    postId,
    title,
    category,
    subCategory,
    source,
    locationAddress,
    locationDetails,
    publishedAt,
  } = post;

  let {
    content
  } = post;

  // remove html tags
  content = striptags(content, ['br']);
  content = content.replace(/(<(br[^>]*)>)/ig, '\n');

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
