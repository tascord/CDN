const a = require('express')();
a.set('view engine', 'ejs');
a.listen(3000, () => console.log('Started!'));

const f = require('fs');
const m = require('multiparty');

a.get('*', (i, o) => {

    let path = i.path.slice(1);
    if(!path) return o.render(`${__dirname}/pages/index.ejs`);
    
    if(path.startsWith('raw/')) {

        path = path.slice(4);

        if(f.existsSync(`${__dirname}/files/${path}`)) o.sendFile(`${__dirname}/files/${path}`, {path});
        else o.render(`${__dirname}/pages/invalid.ejs`);

        return;

    }

    if(f.existsSync(`${__dirname}/files/${path}`)) o.render(`${__dirname}/pages/file.ejs`, {path});
    else o.render(`${__dirname}/pages/invalid.ejs`);

});

a.post('/up', (i, o) => {



});