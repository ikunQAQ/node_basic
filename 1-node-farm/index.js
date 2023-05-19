const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');
/*
///////////////////////////////
//File
   //同步进程 , 线程死锁
   const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
   console.log(textIn);
   const output = `This is what we want know about: ${textIn} \n   Created on ${Date.now()}`;
   fs.writeFileSync('./txt/output.txt', output);
   console.log('File Written!!!');

   //异步进程 , 无死锁
   fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
       console.log(data);
       fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2) => {
           console.log(data2);
           fs.writeFile(`./txt/${data2}.txt`,`${data}+${data2}`,err=>{return console.log('written!!!')})
       })
   });
   console.log('Will read file!');
*/
////////////
//Server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`./dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);


    //OverView Page
    if (pathname == '/overview' || pathname == '/') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        // .map => 增强循环
        // replaceTemplate 自己封装的替换数据的函数
        // join(空字符串) 数组转字符串
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);
    }
    // Product Page
    else if (pathname == '/product') {
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(output);
    } else if (pathname == '/api') {
        fs.readFile(`./dev-data/data.json`, 'utf-8', (err, data) => {
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(data);
        });
    } else {
        // Not Found
        res.writeHead(404, {'Content-type': 'text/html', 'my-own-header': 'hello-world'});
        res.end('page not found!');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
});
//开始监听请求
