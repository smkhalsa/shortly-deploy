var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var localDb = 'mongodb://localhost/local'; //local is the db name
var serverDb = 'mongodb://MongoLab-z:t7y35yBebLREOQZ.fJKpSNgkG2sXDjoNZCjwK06zHLA-@ds036638.mongolab.com:36638/MongoLab-z';
mongoose.connect(process.env.NODE_ENV === 'production' ? serverDb : localDb);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('db connection opened');
});
module.exports = db;
var urls = mongoose.Schema({
  // _id: ObjectId,
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  timestamp: { type: Date, default: Date.now }
});

var users = mongoose.Schema({
  // _id: ObjectId,
  username: String,
  password: String,
  timestamp: { type: Date, default: Date.now }
});


// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;
