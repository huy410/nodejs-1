const express = require("express");
var bodyParser = require('body-parser');
const app = express();
session = require('express-session')
const Category = require("./Models/Category")
const Book = require("./Models/Book")
const User = require("./Models/User");
const FaQs = require("./Models/FaQ");
const { render } = require("ejs");
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.static("public"));
var router = express.Router()
const port = process.env.PORT || 5000;
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4444');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
//body-parser
app.use(bodyParser.urlencoded({extended : false}));
//mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://son:28490@cluster0.hqdak.mongodb.net/bookstore?retryWrites=true&w=majority',function(err){
    if(err){
        console.log('MonfoDb connect err ' + err)
    }else{
        console.log('Connected....')
    }
});
//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    // filename: function (req, file, cb) {
    //   cb(null, Date.now()  + "-" + file.originalname)
    // }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jfif" || file.mimetype=="image/jpeg" || file.mimetype=="image/gif"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("BookImage");
app.get("/api/cate",function(req,res){
    Category.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
//Category
app.put("/api/cate/:id/:name",function(req,res){
    Category.findByIdAndUpdate(req.params.id,{
        name:req.params.name
    },{new: true})
    .then(cate => {
        if(!cate) {
            return res.status(404).send({
                message: "category not found with id " + req.params.id
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "category not found with id " + req.params.id
            });                
        }
        
    })
})
app.get('/cate',function(req,res){
    res.render("Create/Newcate");
})
app.post('/api/cate/:name',function(req,res){
    var newCate = new Category({
        name:req.params.name,
        Books_id : []
    });
    newCate.save(function(err){
        if(err){
            console.log("Save Category error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save Category Successfully...")
            res.json({result:"true"})
        }
    })
})
app.delete("/api/cate/:id",function(req,res){
    Category.findByIdAndRemove(req.params.id)
    .then(cate => {
        if(!cate) {
            return res.status(404).send({
                message: "category not found with id " + req.params.id
            });
        }
        res.send({message: "category deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "category not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
})
//Product Book
app.get("/api/book",function(req,res){
    Book.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
app.get("/",function(req,res){
    res.render("Header")
})
app.get('/book',function(req,res){
    Book.find(function(err,items){
        if(err){
            console.log("Error"+err)
        }else{
            res.render('index/book',{Books:items})
        }
    })
    
})
app.get('/create/book',function(req,res){
    Category.find(function(err,items){
        if(err){
            console.log("Error"+err)
        }else{
            console.log(items)
            res.render("Create/Newbook",{Cates:items})
        }
    })
})
app.post('/create/book',function(req,res){
    //Upload
    console.log(req.body)
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
          res.json({result:"false" ,"error":err});
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
          res.json({result:"false" ,"error":err});
        }else{
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            //res.send({result:true,"file":req.file})
             //Save book
            var newBook = new Book({
                name : req.body.txtName,
                price:req.body.txtPrice,
                describe:req.body.txtDescribe,
                author:req.body.txtAuthor,
                date:req.body.txtQuanlity,
                date:req.body.txtDate,
                image:req.file.filename,
                file:req.body.txtFile 
                
            })
            newBook.save(function(err){
                if(err){
                    console.log("Save Book error !!!" + err)
                    res.json({result:"false"})
                }else{
                    //update category
                    Category.findOneAndUpdate({_id:req.body.selectCate},{$push:{Books_id:newBook._id}},function(err){
                        if(err){
                            res.json({result:"false"})
                        }else{
                            res.json({result:"true"})
                        }
                    })
                    console.log("Save Book Successfully...")

                }
            })
        }

    });
   
})
//upload file



const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//
app.post('/api/book/:name/:price/:author/:describe/:date/:image/:selectCate/:quanlity',function(req,res){
    //Upload
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
          res.json({result:"false" ,"error":err});
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
          res.json({result:"false" ,"error":err});
        }else{
            //console.log(req.file)
            //res.send({result:true,"file":req.file})
             //Save book
            var newBook = new Book({
                name : req.params.name,
                price:req.params.price,
                describe:req.params.describe,
                author:req.params.author,
                date:req.params.date,
                image:req.params.image,
                file:req.params.image,
                categoryId:req.params.selectCate,
                qunality:req.params.quanlity
                
            })
            newBook.save(function(err){
                if(err){
                    console.log("Save Book error !!!" + err)
                    res.json({result:"false"})
                }else{
                    //update category
                    Category.findOneAndUpdate({_id:req.params.selectCate},{$push:{Books_id:newBook._id}},function(err){
                        if(err){
                            res.json({result:"false"})
                        }else{
                            res.json({result:"true"})
                        }
                    })
                    console.log("Save Book Successfully...")

                }
            })
            console.log("Upload is okay");

        }

    });
   
})
app.delete("/api/book/:id",function(req,res){
    Book.findByIdAndRemove(req.params.id)
    .then(book => {
        if(!book) {
            return res.status(404).send({
                message: "book not found with id " + req.params.id
            });
        }
        res.send({message: "book deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "book not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
})

app.get('/edit/book',function(req,res){
    Category.find(function(err,items){
        if(err){
            console.log("Error"+err)
        }else{
            console.log(items)
            res.render("Edit/editBook",{Cates:items})
        }
    })
})
app.put("/edit/book/:id",function(req,res){
    Book.findByIdAndUpdate(req.body.id,{
                name : req.body.name,
                price:req.body.price,
                describe:req.body.describe,
                author:req.body.author,
                date:req.body.date,
                image:req.body.image,
                file:req.body.image,
                categoryId:req.body.selectCate,
                qunality:req.body.quanlity
    }, {new: true})
    .then(book => {
        if(!book) {
            return res.status(404).send({
                message: "book not found with id " + req.body.id
            });
        }
        res.send(book);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "book not found with id " + req.body.id
            });                
        }
    });
})
app.put("/api/book/:id/:name/:price/:author/:describe/:date/:image/:selectCate/:quanlity",function(req,res){
    Book.findByIdAndUpdate(req.params.id,{
                name : req.params.name,
                price:req.params.price,
                describe:req.params.describe,
                author:req.params.author,
                date:req.params.date,
                image:req.params.image,
                file:req.params.image,
                categoryId:req.params.selectCate,
                qunality:req.params.quanlity
    }, {new: true})
    .then(book => {
        if(!book) {
            return res.status(404).send({
                message: "book not found with id " + req.params.noteId
            });
        }
        res.send(book);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "book not found with id " + req.params.noteId
            });                
        }
    });
})
app.delete("/delete/book/:id",function(req,res){
    Book.findByIdAndRemove(req.params.id)
    .then(book => {
        if(!book) {
            return res.status(404).send({
                message: "book not found with id " + req.params.id
            });
        }
        res.send({message: "book deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "book not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
})
app.get("/api/book/:id",function(req,res){
    Book.findById(req.params.id)
    .then(book=>{
        res.json(book)
    })
    .catch(err=>{
        res.json(book)
    }) 
})
//User
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.get('/user',function(req,res){
    res.render('Create/Newuser');
})
app.post('create/user',urlencodedParser,function(req,res){
    var newUser = new User({
        firstName : req.body.txtFirstName,
        lastName:req.body.txtLastName,
        userName:req.body.txtUserName,
        age:req.body.txtAge,
        email:req.body.txtEmail,
        address:req.body.txtAddress,
        phoneNumber:req.body.txtPhoneNumber,
        password:req.body.txtPass,
        dateofbirth:req.body.dob,
       
    })

    newUser.save(function(err){
        if(err){
            console.log("Save User error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save User Successfully...")
            res.json({result:"true",newUser})
        }
    })
});
app.post('/api/user/:username/:age/:email/:address/:phoneNumber/:password/:dateofbirth',urlencodedParser,function(req,res){
    var newUser = new User({
        firstName : req.params.fname,
        lastName:req.params.lname,
        userName:req.params.username,
        age:req.params.age,
        email:req.params.email,
        address:req.params.address,
        phoneNumber:req.params.phoneNumber,
        password:req.params.password,
        dateofbirth:req.params.dateofbirth,
       
    })
    newUser.save(function(err){
        if(err){
            console.log("Save User error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save User Successfully...")
            res.json({result:"true",newUser})
        }
    })
});
app.put("/api/user/:id/:username/:age/:email/:address/:phoneNumber/:password/:dateofbirth",function(req,res){
    User.findByIdAndUpdate(req.params.id,{
        firstName : req.params.fname,
        lastName:req.params.lname,
        userName:req.params.username,
        age:req.params.age,
        email:req.params.email,
        address:req.params.address,
        phoneNumber:req.params.phoneNumber,
        password:req.params.password,
        dateofbirth:req.params.dateofbirth,
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.noteId
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "user not found with id " + req.params.noteId
            });                
        }
    });
})
app.delete("/api/user/:id",function(req,res){
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.id
            });
        }
        res.send({message: "user deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Nouserte not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
})
app.get("/api/user",function(req,res){
    User.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
app.get("/api/user/:id",function(req,res){
    User.findById(req.params.id)
    .then(user=>{
        res.json(user)
    })
    .catch(err=>{
        res.json(err)
    }) 
})
app.post('/api/auth/login/:email/:password',async (req,res)=>{
    User.findOne({email:req.params.email})
    .then(user=>{
        if(!user) res.status(404).json({err:'dont find email '})
        else{
            if(req.params.password == user.password){
                res.status(200).json(user)
            }else{
                res.status(404).json({err:'dont find pass'})
            }
        }
    })
    .catch(err=>{
        res.status(500).json(err)
    })
    // bcrypt.hash(req.params.password,10,(err,hash)
    
})
//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
  }));

//FaQ
app.get("/api/faq",function(req,res){
    FaQs.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
app.post('/api/faq/:name/:describe',urlencodedParser,function(req,res){
    var newFaQ = new FaQs({
        name : req.params.name,
        describe:req.params.describe,
    })
    newFaQ.save(function(err){
        if(err){
            console.log("Save faq error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save faq Successfully...")
            res.json({result:"true",newFaQ})
        }
    })
});
app.delete("/api/faq/:id",function(req,res){
    FaQs.findByIdAndRemove(req.params.id)
    .then(faq => {
        if(!faq) {
            return res.status(404).send({
                message: "faq not found with id " + req.params.id
            });
        }
        res.send({message: "faq deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "faq not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
})
app.put("/api/faq/:id/:name/:describe",function(req,res){
    FaQs.findByIdAndUpdate(req.params.id,{
        name : req.params.name,
        describe:req.params.describe,
    }, {new: true})
    .then(faq => {
        if(!faq) {
            return res.status(404).send({
                message: "faq not found with id " + req.params.noteId
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "faq not found with id " + req.params.noteId
            });                
        }
    });
})
//cart
const Cart = require('./Models/cart')
app.get("/api/cart",function(req,res){
    Cart.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
app.post('/api/cart/:totalquantity/:totalprice/:bookid/:bookName/:bookImg',urlencodedParser,function(req,res){
    var newCart = new Cart({
        totalquantity : req.params.totalquantity,
        totalprice:req.params.totalprice,
        booksId:req.params.bookid,
        bookName:req.params.bookName,
        bookImg:req.params.bookImg,
    })
    newCart.save(function(err){
        if(err){
            console.log("Save cart error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save cart Successfully...")
        }
    })
});
app.put('/api/cart/:id/:totalquantity/:totalprice/:bookid/:bookName/:bookImg',urlencodedParser,function(req,res){
    Cart.findByIdAndUpdate(req.params.id,{
        totalquantity : req.params.totalquantity,
        totalprice:req.params.totalprice,
        booksId:req.params.bookid,
        bookName:req.params.bookName,
        bookImg:req.params.bookImg,
    }, {new: true})
    .then(cart => {
        if(!cart) {
            return res.status(404).send({
                message: "cart not found with id " + req.params.id
            });
        }
        res.send(cart);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "cart not found with id " + req.params.id
            });                
        }
    });
});
app.delete("/api/cart/:id",function(req,res){
    Cart.findByIdAndRemove(req.params.id)
    .then(cart => {
        if(!cart) {
            return res.status(404).send({
                message: "cart not found with id " + req.params.id
            });
        }
        res.send({message: "cart deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "cart not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
})
app.delete("/api/cart",function(req,res){
    Cart.deleteMany()
    .then(success => {
       res.json(success)
    }).catch(err => {
       res.json(err)
    })
});
//Bill
const Bill = require('./Models/Bill')
app.get("/api/bill",function(req,res){
    Bill.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
app.post('/api/bill/:totaorder/:totalprice',urlencodedParser,function(req,res){
    var newBill = new Bill({
        totalOrder : req.params.totaorder,
        totalPrice:req.params.totalprice,
    })
    newBill.save(function(err){
        if(err){
            console.log("Save Bill error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save Bill Successfully...")
        }
    })
});
app.get('/api/bill/:id',(req,res)=>{
    Bill.findById(req.params.id,{
    }, {new: true})
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.json(err)
    })
});
app.delete('/api/bill/:id',(req,res)=>{
    Bill.findByIdAndRemove(req.params.id)
    .then(bill => {
        if(!bill) {
            return res.status(404).send({
                message: "Bill not found with id " + req.params.id
            });
        }
        res.send({message: "Bill deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "bill not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
});
//search book
app.get('/api/search/:name',(req,res,next)=>{
    Book.find({name:{$regex:req.params.name,$options:'$i'}})
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.json(err)
    })
})
app.get('/api/search/',(req,res)=>{
    Book.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
//chatroom
//setting up sockets
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
let num_users_online = 0;
app.get('/chatRoom', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });
  app.use('/static', express.static(path.join(__dirname, 'static')))


  //socket.io:
  io.on('connection', function (socket) {
    //each socket is unique to each client that connects:
    console.log("socket.id: " + socket.id);
  
    //let the clients know how many online users are there:
    io.emit('updateNumUsersOnline', ++num_users_online);
  
    socket.on('username', function (username_from_client) {
      socket.username = username_from_client;
  
      //let all users know that this user has connected:
      io.emit('userConnected', socket.username);
    });
  
    //handle adding a message to the chat.
    socket.on('addChatMessage(client->server)', function (msg) {
      //io.emit(..., ...); - sending the message to all of the sockets.
      io.emit('addChatMessage(server->clients)', [socket.username, prepareMessageToClients(socket, msg)]);
    });
  
    //handle isTyping feature
    //istyping - key down
    socket.on('userIsTypingKeyDown(client->server)', function (undefined) {
      io.emit('userIsTypingKeyDown(server->clients)', [socket.username, prepareIsTypingToClients(socket)]);
    });
  
    //istyping - key up
    socket.on('userIsTypingKeyUp(client->server)', function (undefined) {
      io.emit('userIsTypingKeyUp(server->clients)', socket.username);
    });
  
    socket.on('disconnect', function () {
      io.emit('userDisconnected', socket.username);
      io.emit('updateNumUsersOnline', --num_users_online);
    });
  });
  
  // -------------------------------------------------
  function getParsedTime() {
    const date = new Date();
  
    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
  
    let min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
  
    return (hour + ":" + min);
  }
  
  // Prepare the message that will be sent to all of the clients
  function prepareMessageToClients(socket, msg) {
    return ('<li>' + getParsedTime() + ' <strong>' + socket.username + '</strong>: ' + msg + '</li>');
  }
  
  //prepare the '___ is typing...' message
  function prepareIsTypingToClients(socket) {
    return ('<li><strong>' + socket.username + '</strong> is typing...</li>')
  }
//transport
const Transport = require('./Models/info_transport')
app.post('/api/transport/:fullname/:email/:address/:phonenumber',urlencodedParser,function(req,res){
    var newTransport = new Transport({
        fullname : req.params.fullname,
        email:req.params.email,
        phoneNumber:req.params.phonenumber,
        address:req.params.address,
    })
    newTransport.save(function(err){
        if(err){
            console.log("Save Transport error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save Transport Successfully...")
        }
    })
});
app.get("/api/transport",function(req,res){
    Transport.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
app.delete('/api/transport/:id',(req,res)=>{
    Transport.findByIdAndRemove(req.params.id)
    .then(transport => {
        if(!transport) {
            return res.status(404).send({
                message: "transport not found with id " + req.params.id
            });
        }
        res.send({message: "transport deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "transport not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
});
app.put('/api/transport/:id/:fullname/:email/:address/:phonenumber',urlencodedParser,function(req,res){
    Transport.findByIdAndUpdate(req.params.id,{
        fullname : req.params.fullname,
        email:req.params.email,
        phoneNumber:req.params.phonenumber,
        address:req.params.address,
    }, {new: true})
    .then(transport => {
        if(!transport) {
            return res.status(404).send({
                message: "transport not found with id " + req.params.id
            });
        }
        res.send(cart);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "transport not found with id " + req.params.id
            });                
        }
    });
});
//send gmail
const nodemailer = require('nodemailer')
app.get("/api/sendgmail/:email",function(req,res){
    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"son.tn.269@aptechlearning.edu.vn",
            pass:"01655248973a"
        },
        tls:{
            rejectUnauthorized:false,
        }
    })
    
    let mailOptions = {
        form:"son.tn.269@aptechlearning.edu.vn",
        to:req.params.email,
        subject:"Gmail",
        text:" Đặt Hàng thành công"
    }
    transporter.sendMail(mailOptions,function(err,success){
        if(err){
            console.log(err)
        }else{
            console.log("Email send is success")
        }
    })
})
//contactUs
const Contact = require('./Models/contactus')
app.get("/api/contact",function(req,res){
    Contact.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
app.post('/api/contact/:fullname/:email/:comment',urlencodedParser,function(req,res){
    var newContact = new Contact({
        name : req.params.fullname,
        email:req.params.email,
        comment:req.params.comment,
    })
    newContact.save(function(err){
        if(err){
            console.log("Save contact error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save contact Successfully...")
        }
    })
});
app.delete('/api/contact/:id',(req,res)=>{
    Contact.findByIdAndRemove(req.params.id)
    .then(contact => {
        if(!contact) {
            return res.status(404).send({
                message: "Contact not found with id " + req.params.id
            });
        }
        res.send({message: "Contact deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Contact not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
});
//borrow book
const transportBorrow = require('./Models/borrowBook')
app.post('/api/transportBorrow/:name/:email/:address/:phonenumber/:startDate/:endDate',urlencodedParser,function(req,res){
    var newtransportBorrow = new transportBorrow({
        name : req.params.name,
        email:req.params.email,
        address:req.params.address,
        phonenumber:req.params.phonenumber,
        StartDate:req.params.startDate,
        EndDate:req.params.endDate,
    })
    newtransportBorrow.save(function(err){
        if(err){
            console.log("Save transportBorrow error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save transportBorrow Successfully...")
        }
    })
});
app.get("/api/transportBorrow",function(req,res){
    transportBorrow.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
app.delete('/api/transportBorrow/:id',(req,res)=>{
    transportBorrow.findByIdAndRemove(req.params.id)
    .then(transport => {
        if(!transport) {
            return res.status(404).send({
                message: "transport not found with id " + req.params.id
            });
        }
        res.send({message: "transport deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "transport not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
});
app.put('/api/transportBorrow/:id/:name/:email/:address/:phonenumber/:startDate/:endDate',urlencodedParser,function(req,res){
    transportBorrow.findByIdAndUpdate(req.params.id,{
        name : req.params.name,
        email:req.params.email,
        address:req.params.address,
        phonenumber:req.params.phonenumber,
        StartDate:req.params.startDate,
        EndDate:req.params.endDate,
    }, {new: true})
    .then(transport => {
        if(!transport) {
            return res.status(404).send({
                message: "transport not found with id " + req.params.id
            });
        }
        res.send(cart);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "transport not found with id " + req.params.id
            });                
        }
    });
});
//cart borrow book
const cartborrow = require('./Models/Cartborrow')
app.get("/api/cartborrow",function(req,res){
    cartborrow.find(function(err,items){
        if(err){
            res.json({result:"false","err":err})
        }else{
            res.json(items)
        }
    })
})
app.post('/api/cartborrow/:totalquantity/:totalprice/:bookid/:bookName/:bookImg',urlencodedParser,function(req,res){
    var newcartborrow = new cartborrow({
        totalquantity : req.params.totalquantity,
        totalprice:req.params.totalprice,
        booksId:req.params.bookid,
        bookName:req.params.bookName,
        bookImg:req.params.bookImg,
    })
    newcartborrow.save(function(err){
        if(err){
            console.log("Save cartborrow error !!!" + err)
            res.json({result:"false"})
        }else{
            console.log("Save cartborrow Successfully...")
        }
    })
});
app.put('/api/cartborrow/:id/:totalquantity/:totalprice/:bookid/:bookName/:bookImg',urlencodedParser,function(req,res){
    cartborrow.findByIdAndUpdate(req.params.id,{
        totalquantity : req.params.totalquantity,
        totalprice:req.params.totalprice,
        booksId:req.params.bookid,
        bookName:req.params.bookName,
        bookImg:req.params.bookImg,
    }, {new: true})
    .then(cart => {
        if(!cart) {
            return res.status(404).send({
                message: "cart not found with id " + req.params.id
            });
        }
        res.send(cart);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "cart not found with id " + req.params.id
            });                
        }
    });
});
app.delete("/api/cartborrow/:id",function(req,res){
    cartborrow.findByIdAndRemove(req.params.id)
    .then(cart => {
        if(!cart) {
            return res.status(404).send({
                message: "cart not found with id " + req.params.id
            });
        }
        res.send({message: "cart deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "cart not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
})
app.delete("/api/cartborrow",function(req,res){
    cartborrow.deleteMany()
    .then(success => {
       res.json(success)
    }).catch(err => {
       res.json(err)
    })
});

http.listen(port, function () {
    console.log('listening on localhost:' + port);
});
