const a = require('express')();
a.set('view engine', 'ejs');
a.listen(3000, () => console.log('Started!'));

const f = require('fs');
const m = require('multiparty');

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

a.post('/up', (i, o) => {

    let form = new m.Form();
    form.parse(i, (e, a, d) => {

        if(e)           return o.redirect(`/upload?error=${e}`);
        if(!d.file)     return o.redirect(`/upload?error=No \'file\' field.`);
        if(!d.file[0])  return o.redirect(`/upload?error=No file provided in field \'file\.`);
        if(!a.token)    return o.redirect(`/upload?error=No \'token\' field provided.`)
        if(!a.token[0]) return o.redirect(`/upload?error=No data provided in field \'token\'.`)

        if(a.token[0] !== token) return o.redirect(`/upload?error=Invalid token provided.`);

        let name = `${Date.now()}-${d.file[0].originalFilename}`;

        f.copyFileSync(d.file[0].path, `${__dirname}/files/${name}`);
        o.redirect(`/upload?code=${name}`);


    })

});