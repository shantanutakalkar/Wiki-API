const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

app.route("/articles").get(function(req,res){
    Article.find(function(err,foudArticles){
        if(!err){
            res.send(foudArticles);
        }
        else{
            console.log(err);
        }
        
    });
})

.post(function(req,res){
    console.log();
    console.log();

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            console.log("Succssfully Submitted document");
        }
        else{
            console.log(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Record Deleted Successfullly");
        }
        else{
            res.send(err);
        }
    });
});

//   Request for specific article

app.route("/articles/:articleTitle")

.get(function(req,res){
Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
    if(foundArticle){
        res.send(foundArticle);
    }
    else{
        res.send("No article matching");
    }
});
})

.put(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }
        }

    );
})

.patch(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }
            else{
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){
    Article.findOneAndDelete(
     {title: req.params.articleTitle},
     function(err){
         if(!err){
             res.send("SUccessfully deleted the article");
         }
         else{
             res.send(err);
         }
     }
    );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});