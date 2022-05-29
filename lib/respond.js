//require node module
const path = require('path');
const url = require('url')
const fs =require('fs');
//file imports
const buildBreadCrumb = require('./breadcrumb.js');
const buildMainContent = require('./mainContent.js');
const getMimeType = require('./getMimeType.js');
// static base path
const staticBasePath = path.join(__dirname,'..','static');
//respond to a request
//following is function passed to createServer used to create a server
const respond = (request,response) => {
    let pathname = url.parse(request.url, true).pathname;

    if(pathname === "/favicon.ico"){
        return false;
    }

    pathname = decodeURIComponent(pathname);
    const fullStaticPath = path.join(staticBasePath,pathname);
    if(!fs.existsSync(fullStaticPath)){
        console.log(`${fullStaticPath} does not exist`);
        response.write('404: file not found');
        response.end();
        return false;
    }

    let stats;
    try{
        stats = fs.lstatSync(fullStaticPath);
    }catch(err){
        console.log(`lstatSync Error: ${err}`);
    }

    if(stats.isDirectory()){
        let data = fs.readFileSync(path.join(staticBasePath, 'project_files/index.html'), 'utf-8');
        let pathElements = pathname.split('/').reverse();
        pathElements = pathElements.filter(element => element !== '');
        let folderName = pathElements[0];
        if(folderName === undefined){
            folderName = 'Home';
        }
        const breadCrumb=buildBreadCrumb(pathname);
        const mainContent = buildMainContent(fullStaticPath,pathname);
        data=data.replace('page_title',folderName);
        data=data.replace('pathname',breadCrumb);
        data=data.replace('mainContent',mainContent);
        response.statusCode=200;
        response.write(data);
        return response.end();
    }

    if(!stats.isFile()){
        response.statusCode = 401;
        response.write('401: Access Denied');
        console.log('not a file');
        return response.end();
    }
    let fileDetails = {};
    
    fileDetails.extname = path.extname(fullStaticPath);
     //file size
     let stat;
     try{
         stat = fs.statSync(fullStaticPath);
     }catch(err){
         console.log(`error: ${err}`);
     }
     fileDetails.size = stat.size;

    getMimeType(fileDetails.extname)
    .then(mime =>{
        let head = {};
        let options = {};
        let statusCode = 200;

        head['Content-Type'] = mime;
        
        if(fileDetails.extname === '.pdf'){
            head['Content-Disposition'] = 'inline';
        }
        if(RegExp('audio').test(mime) || RegExp('video').test(mime)){
            //header
            head['Accept-Ranges'] = 'bytes';
           

            const range = request.headers.range;
            console.log(`range: ${request.headers.range}`);
            if(range){
                //bytes=5210112-end
                //5210112-end
                //[5210112,end]
                const start_end = range.replace(/bytes=/, "").split('-');
                console.log(start_end);
                const start = parseInt(start_end[0]);
                console.log(start);
                const end = start_end[1]
                ? parseInt(start_end[1])
                : fileDetails.size - 1;
                //0 ... last byte
                console.log(end);
                //headers
                //Content-Range
                head['Content-Range'] = `bytes ${start}-${end}/${fileDetails.size}`;
                //Content-Length
                head['Content-Length'] = end - start + 1;
                statusCode = 206;
                
                //options
                options = {start, end};
            }


        }

        //fs.promises.readFile(fullStaticPath,'utf-8')
          //  .then(data => {
            //    response.writeHead(statusCode,head);
             //   response.write(data);
            //    return response.end();
            //})
            //.catch(error =>{
            //    console.log(error);
            //    response.statusCode = 404;
            //    response.write('404: File reading error');
            //    return response.end();
            //});

            

            const fileStream = fs.createReadStream(fullStaticPath,options);
            response.writeHead(statusCode,head);
            fileStream.pipe(response);

            fileStream.on('close', () => {
                return response.end();
            });
            fileStream.on('error', error => {
                console.log(error.code);
                response.statusCode = 404;
                response.write('404: File reading error!');
                return response.end();
            });
    })
    .catch(err => {
        response.statusCode = 500;
        response.write('500: Internal Server Error');
        console.log(`Promise error: ${err}`);
        return response.end();
    })
}
module.exports = respond;
//before working with pathname you need to decode it

//get the corespondong full static path

//can we find something

//no: send 404

// we found something
//is it a file or a directory



