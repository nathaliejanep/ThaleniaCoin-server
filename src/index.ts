import express, { urlencoded, json } from 'express';
// https://dev.to/ibrocodes/a-simple-guide-to-setting-up-typescript-with-nodejs-and-express-2024-lej
const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Server is up and running' });
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
