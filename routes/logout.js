exports.post = function(req, res) {
    req.sessions.destroy();
    res.redirect('/');
};