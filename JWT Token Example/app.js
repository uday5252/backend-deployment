const Express = require("express")
const JWT = require("jsonwebtoken")
const CookieParser = require("cookie-parser")
const app = Express()
app.use(Express.urlencoded())
app.use(CookieParser())

app.get("/login", function(req, res)
{
    res.render("login.ejs")
})

app.get("/home", function(req, res)
{
    res.render("home.ejs")
})

function verifyToken(req, res, next)
{
    // Is there any token available or not
    const fetchedToken = req.cookies.token

    if(!fetchedToken)
    {
        res.redirect("/login")
    }
    else
    {
       // server recieved the token
       JWT.verify(fetchedToken, "Javascript", function(error)
        {
            if(error)
            {
                res.redirect("/login")
            }           
            else
            {
                next()
            }
        }) 
    }
}

app.get("/books", verifyToken, function(req, res)
{
    res.render("books.ejs")
})

// verifyToken ==> Middleware

app.get("/mobiles", verifyToken, function(req, res)
{
    res.render("mobiles.ejs")
})

// If a client is accessing /mobiles OR /books, server should
// check whether token is coming or not
// If there is correct token then give output, otherwise display login page

app.post("/login", function(req, res)
{
    const enteredUsername = req.body.username
    const enteredPassword = req.body.password

    // Generate the token
    const jwtToken = JWT.sign( { "name": enteredUsername }, "Javascript", 
        { expiresIn: "20s"})

    // JWT Token should be sent to client(browser)

    res.cookie("token", jwtToken)

    res.redirect("/home")
})

app.listen(3000, function()
{
    console.log("Server is running on the port 3000!")
})