var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../../lib/utility');

var db = require('./config');
var User = require('./models/user');
var Link = require('./models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().exec(function(err, links) {
    if (err) return res.send(500, 'server error');
    if (links) return res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }).exec(function(err, found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        link.save(function(err, newLink) {
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec(function(err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  // console.log('in signup user')
  // new User({username: 'unique3', password: '123'}).save();
  // User.create({username: 'create', password: '123'});
  // User.find({}).exec().then(function(err, users) {
  //   if (err) console.error('error: ', err);
  //   if (users) console.log('users: ',users);
  // })
  // .then(function(users) {console.log(users);});
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(err, user) {
      if (err) { console.log(err); return res.send(500, 'Internal server error'); }
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
      console.log(user);
        newUser.save(function(err, newUser) {
          if (err) { return res.send(500, err); }
          console.log(newUser);
          util.createSession(req, res, newUser);
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    })
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }).exec(function(err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err, link) {
          return res.redirect(link.url);
      });
    }
  });
};
