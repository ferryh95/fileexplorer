const path = require('path');

const buildBreadCrumb = pathname => {
    const pathChunks = pathname.split('/').filter(element => element !== '');
    
    let breadcrumb = `<li class="breadcrumb-item"><a href="/">Home</a></li>`;

    let link='/';
    pathChunks.forEach((item,index) => {
        link =  path.join(link,item);
        if(index !== pathChunks.length - 1){
            breadcrumb += `<li class="breadcrumb-item"><a href="${link}">${item}</a></li>`;
        }else{
            breadcrumb += `<li class="breadcrumb-item" aria-current="page">${item}</li>`;
        }
    });
    return breadcrumb;
};
module.exports=buildBreadCrumb;