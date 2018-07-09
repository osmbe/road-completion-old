module.exports = function (app)
{
    app.get("/ISSUE", function(req, res)
    {
        // receive an issue and put it inside of the data base
    });
    app.get("/ISSUES", function(req, res)
    {
        // receive all issues (this means we'll clear the database)
    });
    app.post("/ISSUE", function(req, res)
    {
        // receive and issue and change its status to fixed
    });
    app.post("/ISSUES", function(req, res)
    {
        // I don't really remember what we were doing with this
    });

}