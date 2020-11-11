const a = require('express')();
a.set('view engine', 'ejs');
a.listen(3000, () => console.log('Started!'));

const f = require('fs');
const m = require('multer');

const u = m({ storage: require('./storage')({ destination: (r, f, c) => { c(null, 'files'); } }) })

const token = process.env.TOKEN || 'something secure lol';

a.get('*', (i, o) => {

    let path = i.path.slice(1);
    if(!path) return o.render(`${__dirname}/pages/index.ejs`);
    
    if(path === 'upload') return o.render(`${__dirname}/pages/upload.ejs`);

    if(path.startsWith('raw/')) {

        path = path.slice(4);

        if(f.existsSync(`${__dirname}/files/${path}`)) o.sendFile(`${__dirname}/files/${path}`, {path});
        else o.render(`${__dirname}/pages/invalid.ejs`);

        return;

    }

    if(f.existsSync(`${__dirname}/files/${path}`)) o.render(`${__dirname}/pages/file.ejs`, {path});
    else o.render(`${__dirname}/pages/invalid.ejs`);

});

//

a.post('/up', u.single('file'), (i, o) => {

    console.log('okiedokei');
    o.status(204).end();

});