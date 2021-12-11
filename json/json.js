// var http = require('http'); // Import Node.js core module
express = require('express');
fs = require('fs');
bodyParser = require('body-parser');
const app = express();
const portaSql = 1278; //porta Banco de dados
const sql = require('mssql');

// conexão 192.175.175.6:1271
const conexaoStr = {
    "user": 'portal',
    "password": 'portal',
    "server": '192.175.175.6',
    "database": 'PROTHEUS12_R27',
    "port": 1433,
    "rejectUnauthorized": true,
    "requestCert": true,
    "options": {
        "encrypt": false,
        "enableArithAbort": true
    },
    "dialect": "mssql",
    "dialectOptions": {
        "instanceName": "MSSQLSERVER"
    }
};

//conexao com BD
sql.connect(conexaoStr)
    .then(conexao => global.conexao = conexao)
    .catch(erro => console.log(erro));

// configurando o body parser para pegar POSTS mais tarde   
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//acrescentando informacoes de cabecalho para suportar o CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PATCH, DELETE");
    next();
});
//definindo as rotas
const rota = express.Router();
rota.get('/', (req, res) => res.json({ mensagem: 'json ok' }));
app.use('/', rota);

//inicia servidor
app.listen(portaSql);
console.log('api json ok, porta: ' + portaSql);

function execSQL(sql, res) {
    global.conexao.request()
        .query(sql)
        .then(resultado => res.json(resultado.recordset))
        .catch(erro => res.json(erro));
}


//excel dos status dos pedidos
rota.post('/cadUsuarios', (req, res) => {
    let xcSql = '';
    const senPass = req.body.senPass;
    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	vw_cadastroUsuarios "
    console.log(xcSql)
    execSQL(xcSql, res);
})

//excel dos status dos pedidos
rota.post('/cadFornecedores', (req, res) => {
    let xcSql = '';
    const senPass = req.body.senPass;
    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	vw_cadastroFornecedores "
    console.log(xcSql)
    execSQL(xcSql, res);
})


//excel dos status dos pedidos
rota.post('/cadProdutos', (req, res) => {
    let xcSql = '';
    const senPass = req.body.senPass;
    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	vw_cadastroProdutos "
    console.log(xcSql)
    execSQL(xcSql, res);
})

//excel dos status dos pedidos
rota.post('/amarraFornecProduto', (req, res) => {
    let xcSql = '';
    const codFor = req.body.codFor;
    const codLoja = req.body.codLoja;
    const codGrupo = req.body.codGrupo;

    xcSql += "EXEC "
    xcSql += "	sp_atualizaProdFor "
    xcSql += "  '" + codFor + "',  "
    xcSql += "  '" + codLoja + "', "
    if (codGrupo === '') {
        xcSql += "  ' ' "
    }else{
        xcSql += "  '" + codGrupo + "' "
    }

    console.log(xcSql)
    execSQL(xcSql, res);
})

//excel dos status dos pedidos
rota.post('/geraListaFornecProd', (req, res) => {
    let xcSql = '';
    const mailFor = req.body.xcEmail;
    const contatoFor = req.body.xcContato;
    const codFor = req.body.codFor;
    const codLoja = req.body.codLoja;
    const codGrupo = req.body.codGrupo;

    xcSql += "EXEC "
    xcSql += "	sp_geraListaFornec "
    xcSql += "  '" + codFor + "',  "
    xcSql += "  '" + codLoja + "', "
    if (codGrupo === '') {
        xcSql += "  ' ', "
    }else{
        xcSql += "  '" + codGrupo + "', "
    }
    xcSql += "  '" + mailFor + "', "
    xcSql += "  '" + contatoFor + "' "

    console.log(xcSql)
    execSQL(xcSql, res);
})

//cadastro de grupos de produtos
rota.post('/cadGrupoProdutos', (req, res) => {
    let xcSql = '';
    const senPass = req.body.senPass;
    xcSql += "SELECT "
    xcSql += "	grupo, descricao, qtde, grupo + ' - ' + descricao lista "
    xcSql += "FROM "
    xcSql += "	vw_grupoProdutos "
    xcSql += "ORDER BY "
    xcSql += "	2 "
    console.log(xcSql)
    execSQL(xcSql, res);
})

//cadastro de grupos de produtos
rota.post('/listaProdFornecedores', (req, res) => {
    let xcSql = '';
    const codId = req.body.codId;
    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	vw_listaProdutoParaFornecedor "
    xcSql += "WHERE "
    xcSql += "	idcod = '" + codId + "' "
    xcSql += "ORDER BY "
    xcSql += "	5 "
    console.log(xcSql)
    execSQL(xcSql, res);
})

//Atualização dos preços pelo fornecedor
rota.post('/atuFornecProd', (req, res) => {
    let xcSql = '';
    const codProd = req.body.codProd;
    const valPreco = req.body.valPreco;
    const codFornec = req.body.codFornec;
    const codId = req.body.codId;

    xcSql += "EXEC "
    xcSql += "	sp_atuFornecProd "
    xcSql += "  '" + codProd + "',  "
    xcSql += "  '" + valPreco + "', "
    if (codFornec === '') {
        xcSql += "  ' ', "
    }else{
        xcSql += "  '" + codFornec + "', "
    }
    xcSql += "  '" + codId + "' "

    console.log(xcSql)
    execSQL(xcSql, res);
})


//mantem sempre no final, n�o seu o que �
rota.post('/salvaJSON', (req, res) => {
    fs.writeFile(req.body.arquivo, req.body.json);
})