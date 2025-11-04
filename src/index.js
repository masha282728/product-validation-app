const app = require('./app');
const port = process.env.PORT || 4000;
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`✅ Server listening on port ${port}`);
});