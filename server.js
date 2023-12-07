const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
// middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// apis
app.get('/hello', (req, res) => { res.json({ message: 'Hello from server!' }); });
app.use('/api/admin', require('./api/admin'));
app.use('/api/customer', require('./api/customer'));

// deployment
const path = require('path');

app.use('/admin', express.static(path.resolve(__dirname, 'client-admin/build')));
app.get('admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client-admin/build', 'index.html'))
});

app.use('/', express.static(path.resolve(__dirname, 'client-user/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client-user/build', 'index.html'));
});