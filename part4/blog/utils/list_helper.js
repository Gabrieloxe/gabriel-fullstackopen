const _ = require('lodash');

const dummy = blogs => {
  console.log(blogs);
  return 1;
};

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favouriteBlog = blogs => {
  const fav = blogs.reduce(
    (prev, current) => (prev.likes > current.likes ? prev : current),
    {}
  );

  if (!fav.title) {
    return {};
  }

  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes,
  };
};

const mostBlogs = blogs => {
  const authorBlogCounts = _.countBy(blogs, 'author');
  const authorBlogArray = _.map(authorBlogCounts, (blogs, author) => ({
    author,
    blogs,
  }));
  return _.maxBy(authorBlogArray, 'blogs') || {};
};

const mostLikes = blogs => {
  const authorLikes = _.groupBy(blogs, 'author');
  const authorLikesArray = _.map(authorLikes, (blogs, author) => ({
    author,
    likes: totalLikes(blogs),
  }));
  return _.maxBy(authorLikesArray, 'likes') || {};
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
