const logResponse = (req: {params: any; query: any;}, res: {on: (arg0: string, arg1: () => void) => void; statusCode: any;}, next: () => void) => {

  res.on('finish', () => {
    console.log('Params: ', req.params);
    console.log('Query: ', req.query);
    console.log(`Responded with status ${res.statusCode}`);
  });

  next();
};

module.exports = { logResponse };
