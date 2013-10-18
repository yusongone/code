var express=require("express"),
    MemoryStore=new express.session.MemoryStore,
    format=require("util").format,
    router=require("./router"),
    config=require("./config.json");

var app = express();


app.configure(function(){
    app.set("title","what");
    app.use("/images",express.static(__dirname + '/public/images'));
    app.use("/js",express.static(__dirname + '/public/js'));
    app.use("/css",express.static(__dirname + '/public/css'));
    app.use(express.cookieParser("keyboard cat"));
    app.use(express.session({
        "secret":"secret",
        "store":MemoryStore
        }));
    app.use(express.bodyParser());

    app.engine("html",require("ejs").renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/template');
});

router.init(app);


app.listen(3000);

