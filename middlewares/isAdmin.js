exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.usertype === 'Admin') {
    console.log(req.session.user.usertype);

    return next();
  }

  return res.redirect('/404');
}