export {};
const fs = require('fs');

const writeNewJson = (req: any, res: {status: (arg0: number) => {(): any; new(): any; send: {(arg0: any): void; new(): any;};};}, data: any) => {
  fs.writeFile('app/store.json', data, (err: any) => {
    if (err) console.log(err);
    res.status(201).send(data);
  });
};


module.exports = { writeNewJson };
