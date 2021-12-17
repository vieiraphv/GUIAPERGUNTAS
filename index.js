const express = require("express");
var app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta")

connection
.authenticate()
.then(()=>{
    console.log("Conexão bem sucedida")
})
.catch((msgerro)=>{
    console.log(msgerro)
})



//setando EJS como view engine
app.set('view engine','ejs')
app.use(express.static('public'))
//body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//rotas
app.get("/",(req,res)=> {
    Pergunta.findAll({raw:true, order:[
        ['id', 'DESC']
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        }) 
    })
   
})

app.get("/perguntar",(req,res)=> {
    res.render("perguntar")
})

app.post("/salvapergunta",(req,res)=> {
var titulo = req.body.titulo
var descricao = req.body.descricao

Pergunta
.create({
    titulo: titulo,
    descricao: descricao
    })
.then(()=>{
    res.redirect("/")
})


})


app.get("/pergunta/:id",(req,res) =>{
    var id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if(pergunta != undefined) {

            Resposta.findAll({
                where: {perguntaid: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas =>{

                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                })

            })


        }else{
            res.redirect("/")
            console.log("Id nao encontrado")
        }
    })
})

app.post("/responder",(req, res) =>{
    var corpo = req.body.corpo
    var perguntaid = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaid: perguntaid
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaid)
    })
})

app.listen(5000,()=>{
    console.log("App rodando")
})