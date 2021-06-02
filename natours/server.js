const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful'));

//--------------server listening----------------//

//we define a port variable
const port = process.env.PORT || 3000;

//app will accept requests at that port of localhost
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
