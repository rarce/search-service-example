const app = require('express')();
const http = require('http').Server(app);
const search = require('./search');

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/suggest', (req, res) => {
  search.searchModel(req.query.q, req.query.page)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      console.log(err);
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
