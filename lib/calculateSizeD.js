const {execSync} = require('child_process');

const calculateSizeD = itemFullStaticPath => {
    const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g,'\ ');

    const commandOutput = execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();
    //console.log(commandOutput);

    let fileSize = commandOutput.replace(/\s/g,'');

    fileSize = fileSize.split('/');
    fileSize = fileSize[0];
    const fileSizeUnit = fileSize.replace(/\d|\./g,'');
    //console.log(fileSizeUnit);
    const fileSizeNUmber = parseFloat(fileSize.replace(/[a-z]/i,''));
    //console.log(fileSizeNUmber);

    const units = "BKMGT";

    const fileSizeBytes = fileSizeNUmber * Math.pow(1000, units.indexOf(fileSizeUnit));
    

    return [fileSize, fileSizeBytes];

};
module.exports = calculateSizeD;