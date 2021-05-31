const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// console.log(process.env);
//--------------server listening----------------//

//we define a port variable
const port = process.env.PORT || 3000;

//app will accept requests at that port of localhost
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
