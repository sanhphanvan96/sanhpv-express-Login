import express from "express";
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import url from "url";
import session from "express-session";
import minify from "express-minify";
import querystring from "querystring";
import helmet from "helmet";
import compression from 'compression';
import {join, resolve} from "path";
import csrf from "csurf";
import debug from "debug";
import nunjucks from "nunjucks";

const app = express();

// Logs
app.use(morgan('dev'));

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Query String
app.use((req, res, next) => {
    req.query = querystring.parse(
        url.parse(req.url).query
    );
    next();
});

// Enable Cookie
app.use(cookieParser());

// Session
app.use(session({
    secret: 'demoApp',
    resave: true,
    saveUninitialized: false
}));

// Helmet and CSRF Protection
app.use(helmet());
app.use(csrf({cookie: true}));

// Minifying
app.use(compression());
app.use(minify());
// Serve Static Resources
app.use('/static', express.static(join(__dirname, "../../", "public")));

nunjucks.configure(join(__dirname, "../../", "views"), {
    autoescape: true,
    cache: false,
    express: app
} ) ;

// Set Nunjucks as rendering engine for pages with .html suffix
app.engine( 'html', nunjucks.render ) ;
app.set( 'view engine', 'html' ) ;

app.get("/", (req, res, next) => {
    res.render('index.html', {title: "Nunjucks"});
});

app.listen(process.env.PORT || 3000, () => {
    debug("DemoApp")(`Server is running at port ${(process.env.PORT || 3000)}`);
});

export default app;

