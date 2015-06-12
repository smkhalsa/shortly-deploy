var db = require('../config');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));


var User = mongoose.model("User", db.userSchema);

db.userSchema.pre('save', function(next) {
  console.log('pre-save ran')
  return bcrypt.hashAsync(this.password, null, null).bind(this)
  .then(function(hashPw) {
    this.password = hashPw;
    console.log(this.password);
    next();
  });
});

//similar to User.prototype.comparePassword. allow all model instances aka documents access to fn
User.prototype.comparePassword = function(enteredPw, cb) {
  bcrypt.compareAsync(enteredPw, this.password)
  .then(function(isMatch) {
    cb(isMatch);
  });
};

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

module.exports = User;
