

const http = require('http')
const server = http.createServer((req,res)=>{
    if(req.method == 'GET'){
        res.statusCode = 400
        res.end('GET METHOD')
        
    }
    else if(req.method == 'POST'){
        res.end('POST METHOD')
    }
    else if(req.method == 'PUT'){
        res.end('PUT METHOD')
    }
    else if(req.method == 'PATCH'){
        res.end('PATCH METHOD')
    }
    else if(req.method == 'DELETE'){
        res.end('DELETE METHOD')
    }
})

server.listen(3000,()=>{
    console.log("server started ")
})

