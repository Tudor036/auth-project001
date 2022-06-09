// ----- IMPORTS -----

const path = require('path');
const url = require('url');

const express = require('express');

const csurf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const key = require('./serviceKey.json');
const { query } = require('express');

// ----- INIT SERVICES -----

const app = express();
const PORT = process.env.PORT || 5000;

initializeApp({
    credential: admin.credential.cert(key)
})

const auth = getAuth();
const csrfProtection = csurf({ cookie: true });

// ----- CONFIG MIDDLEWARE -----

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfProtection);

app.use(express.static('static'));

app.use('/css', express.static(path.join(__dirname, "static/css")))
app.use('/scripts', express.static(path.join(__dirname, "static/scripts")))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ----- ROUTES -----

app.all('*', (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
})

app.get('/', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    
    auth
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
        res.redirect('/dashboard');
    })
    .catch(() => {
        res.render("layout", { page: 'home', uid: undefined });
    });
})

app.get('/login', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    
    auth
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(({ uid }) => {
        res.redirect('/dashboard');
    })
    .catch(() => {
        res.render("layout", { page: 'login', uid: undefined });
    });
})

app.get('/register', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    
    auth
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
        res.redirect('/dashboard');
    })
    .catch(() => {
        res.render("layout", { page: 'register', uid: undefined });
    });
})

app.get('/dashboard', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    
    auth
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(({ uid }) => {
        res.render("layout", { page: "dashboard", uid: uid });
    })
    .catch(() => {
      res.redirect("/login");
    });
})

app.get('/admin', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    const adminCookies = req.cookies.role || "user"

    auth
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(({ uid }) => {
        console.log("Logged in:", uid);

        if(adminCookies == "admin") {
            res.render("layout", { page: "admin", uid: uid });
        } else if(adminCookies == "user") {
            res.redirect('/dashboard');
        }

        res.end();
    }) 
    .catch(() => {
      res.redirect("/login");
    });
})

// ---- AUTH ROUTES ----

app.post('/sessionLogin', async (req, res) => {
    const idToken = req.body.token?.toString();
    const role = req.body.role;

    const expiresIn = (60 * 60 * 24 * 1000) * 5;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    try {
        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
        res.cookie("session", sessionCookie, options);
        res.cookie("role", role, options);
        res.end(JSON.stringify({ status: "success" }));
    } catch (err) {
        console.log(err);
    }
})

app.get('/sessionLogout', (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
})

app.get("*", (req, res) => {
    res.render('layout', { page: "nomatch", uid: undefined })
})

// ----- ACTIVATE APP -----

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}...`);
})