const {execSync} = require('child_process');

const calculateSizeF = stats => {

    const fileSizeBytes = stats.size;
    const units = "BKMGT";

    const index = Math.floor(Math.log10(fileSizeBytes)/3);
    const fileSizeHumans = (fileSizeBytes/Math.pow(1000,index)).toFixed(1);
    const unit = units[index];
    fileSize = `${fileSizeHumans}${unit}`;
    
    return [fileSize, fileSizeBytes];

};
module.exports = calculateSizeF;