exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.usertype === 'Admin') {
    console.log(req.session.user.usertype);
    req.user = req.session.user;
    return next();
  }

  return res.redirect('/404');
}