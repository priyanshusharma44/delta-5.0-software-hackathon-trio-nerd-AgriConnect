const sequelize = require('../config/database');
const Blog = require('./blogModel');
const Comment = require('./commentModel');
const User = require('./userModel');

User.hasMany(Comment, { foreignKey: 'userId', as: 'userComments' }); // ✅ Unique alias "userComments"
Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
});

Blog.hasMany(Comment, { foreignKey: 'postId', as: 'blogComments' }); // ✅ Unique alias "blogComments"
Comment.belongsTo(Blog, {
  foreignKey: 'postId',
  as: 'blog',
  onDelete: 'CASCADE',
});

module.exports = { sequelize, User, Blog, Comment };
