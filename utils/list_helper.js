

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

module.exports = {
  totalLikes,
  totalLikesWithOne,
  zeroLikes
}