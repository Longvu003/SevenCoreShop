const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'urls.txt');

console.log('Cron job đang chạy...');

cron.schedule('*/30 * * * * *', async () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        
        const urls = data.split('\n').map(url => url.trim()).filter(url => url !== '');

        for (const url of urls) {
            try {
                const response = await axios.get(url);
                console.log(`Response from server at ${url}:`, response.data);
            } catch (error) {
                console.error(`Error making request to ${url}:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error reading the URL file:', error.message);
    }
});
