var express=require("express"),
    MemoryStore=new express.session.MemoryStore,
    format=require("util").format,
    router=require("./router"),
    MongoStore=require("connect-mongo")(express),
    session_conf=require("./config.json").session;
var store=new MongoStore({
            db:session_conf.name,
            host:session_conf.path,
            port:session_conf.port,  // optional, default: 27017
            username:session_conf.user, // optional
            password:session_conf.pass, // optional
            collection:session_conf.collection,// optional, default: sessions
            clear_interval:600
        });

var app = express();


app.configure(function(){
    app.set("title","what");
    app.use("/images",express.static(__dirname + '/public/images'));
    app.use("/js",express.static(__dirname + '/public/js'));
    app.use("/css",express.static(__dirname + '/public/css'));
    app.use(express.cookieParser("keyboard cat"));
    app.use(express.session({
        "secret":"secret",
        "cookie":{
            maxAge:5*60*1000
        },
        "store":store
    }));
    app.use(express.bodyParser());

    app.engine("html",require("ejs").renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/template');
});

router.init(app);


app.listen(3000);

