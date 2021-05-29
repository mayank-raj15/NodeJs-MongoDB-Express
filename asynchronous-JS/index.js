const fs = require('fs');

//superagent is an npm package that allows us to send http requests to different sites
const superagent = require('superagent');

//this is a manually created promise that will read a file
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      //if there is an error, we use reject to mark promise as rejected and return the error
      if (err) reject('No such file');
      //if there is no error we use resolve to send back the data or anything else we want to send back
      resolve(data);
    });
  });
};

//this is also a manually created promise that will write data to a file
const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('File cannot be written');
      //here since we don't want to send anything specific, so we just used resolve to send success, which we may or may not accept and use while consuming a promise
      resolve('success');
    });
  });
};

//this is the best way of consuming multiple promises simultaneously
//we save all the promises to variables
//then we await all the promises simultaneously using Promise.all([,,,]), this array will contain all the promises that are need to be consumed
//then we can map the resultant array after promises are consumed and do whatever we want to do with the data
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePro('dog-img.txt', imgs.join('\n'));
    console.log('Random dog image saved to file');
  } catch (err) {
    console.log(err);
    throw err;
  }
  //returning something from an asynchronous function/promise
  return '2: Ready ***';
};

//this is the async/await function used to get one random dog image
//here we use try and catch, try holds all the code that needs to be executed, catch holds the code that needs to be executed in case of an error
//we use await to wait for a promise to return a value
//this way we wait for all the promises until they are done

/* const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro('dog-img.txt', res.body.message);
    console.log('Random dog image saved to file');
  } catch (err) {
    console.log(err);
    throw err;
  }
  return '2: Ready ***';
}; */

//this is the same function as below but actually implemented using async/await
(async () => {
  try {
    console.log('1: Will get dog pics');
    //we await for the getDogPic which is actually a promise that will return some data
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics');
  } catch (err) {
    console.log('ERROR **********');
  }
})();

//This is the way to return something from an async function, we use then and catch here,
//getDogPic which is an ansynchronous function will actually return a promise so we can use then method on it use the returned data
//also there is catch method to detect any error

/* console.log('1: Will get dog pics');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('3: Done getting dog pics');
  })
  .catch((err) => {
    console.log('ERROR **********');
  }); */

//this is the longest method of consuming promises and avoiding callback hell
//here the readFilePro will return the data as promised and then superagent will return the response then writefilepro will write the file and will actually not be needed to return anything then we can simply log to the console that the data is saved to the file
//here in this case we will only need only one catch function to detect any error coming from any of the promises

/* readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to file');
  })
  .catch((err) => {
    console.log(err);
  }); */
