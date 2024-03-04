const passport = require('passport');
const bcrypt = require('bcrypt');


module.exports = function (app, myDataBase) {
  app.route('/').get((req, res) => {
    // Change the response to render the Pug template
   // res.render('pug', { title: 'Connected to Database', message: 'Please login', showLogin: true, showRegistration: true, showSocialAuth: true });
  res.render('login');
  });
  app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });
  app.route('/profile').get(ensureAuthenticated, (req, res) => {
    console.log(req.user.username);
    res.render('profile', { username: req.user.username });
  });
  app.route('/chat').get(ensureAuthenticated, (req, res) => {
    console.log(req.user);
    res.render('pug/chat', { user: req.user });
  });
  app.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
  });
  app.route('/register').post(
    (req, res, next) => {
      const hash = bcrypt.hashSync(req.body.password, 12);
      myDataBase.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
          next(err);
        } else if (user) {
          res.redirect('/');
        } else {
          myDataBase.insertOne({ username: req.body.username, password: hash }, (err, doc) => {
            if (err) {
              res.redirect('/');
            } else {
              next(null, doc.ops[0]);
            }
          });
        }
      });
    },
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );

  app.route('/auth/github').get(passport.authenticate('github'));
  app.route('/auth/github/callback').get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    req.session.user_id = req.user.id;
    res.redirect('/chat');
  });





app.route('/resume').get((req,res)=>{
res.render('resume');
})


app.route('/convert').get((req,res)=>{
  res.render('convert');
})



app.route('/game').get((req,res)=>{
  res.render('game');
})


app.route('/music').get((req,res)=>{
  res.redirect('https://codepen.io/abhishek1085/full/QWEWwZM');
})




app.route('/graph').get((req,res)=>{
  res.render('graph');
})


app.route('/tutorial').get((req,res)=>{
  res.render('tutorial');
})


  app.use((req, res, next) => {
    res.status(404).type('text').send('Not Found');
  });
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

