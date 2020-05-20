const totalLikes = (blogs) => {
  const total = blogs.reduce((accum, item) => accum + item.likes, 0)
  return total;
}

const totalLikesWithOne = (listWithOneBlog) => {
  const total = Number(listWithOneBlog.map(blog => blog.likes));
  return total;
}

const zeroLikes = () => {
  return 0;
}

const mostLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const mostLikes = Math.max(...likes);
  const mostLiked = blogs.filter(blog => blog.likes === mostLikes)[0];
  return mostLiked;
}

module.exports = {
  totalLikes,
  totalLikesWithOne,
  zeroLikes,
  mostLikes
}