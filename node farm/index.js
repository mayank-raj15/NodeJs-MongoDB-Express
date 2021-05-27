//importing in-built modules
const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

//importing custom-module
const replaceTemplate = require('./modules/replaceTemplate');

//---------------------------FILES---------------------------//
// //Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// //Non-blocking, asynchronous way
// fs.readFile('./txt/star3t.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR!');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('File has been written!');
//       });
//     });
//   });
// });

// console.log('Will read file!');

//--------------------------SERVER------------------------//

//reading the template files and saving them to a variable as a string
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

//reading the data file as a string
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

//converting the data file into a JS object
const dataObj = JSON.parse(data);

//this is our server where everything happens on the site
const server = http.createServer((req, res) => {
  //req.url object has two properties: query and pathname, so we parse req.url to a JS object and then save the query and pathname of the url
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === '/' || pathname === '/overview') {
    //replacing the tempCard for each item one by one and adding all of that to create a string
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    //finally in the overview temlate, we change the product card to the cardsHtml
    const output = tempOverview.replace('{%product_card%}', cardsHtml);

    //this defines status code as 200 and content type as text/html which the browser will read
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(output);
  }

  //product page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    //for a particular product page, we use the query property of url to get the id of the item
    //and then from the data object we extract that item and save it
    const product = dataObj[query.id];

    //finally we replace the current template which is empty, with the the product that we just extracted from the data object
    const productHtml = replaceTemplate(tempProduct, product);

    //finally we send the finished string of template
    res.end(productHtml);
  }

  //api
  else if (pathname === '/api') {
    //this just sends the data as a json file to the browser
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  //not found
  else {
    //for 404 errors, we can send the meta data that will store the status code, some headers, or headers that you can manually create
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'can do this too',
    });

    //the string send will be treated as html
    res.end('<h1>Page not found!</h1>');
  }
});

//server will listen at port 1000 and address '127.0.0.1' which is also the localhost
server.listen(8000, '127.0.0.1', () => {
  console.log('Server is started!');
});
