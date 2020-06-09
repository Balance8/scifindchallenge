Heroku (free)
Prisma Cloud (free)

1. Production database
2. Host our Prisma docker container
3. Host our node.js application

DEV:

prisma deploy -e ../config/dev.env

npm run dev

PROD:

prisma deploy -e ../config/prod.env

npm start

git push heroku master

heroku config:set FOO=bar

npm run test

DB:d9iq0g8ro00h38

TODO:

1. sign-in double check (converting to functional component and rewiring user login)
2. sign-up double check (converting to functional component and rewiring user login)
3. create payment end point for stripe

```
app.post('/payment', (req, res) => {
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: 'usd'
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.status(500).send({ error: stripeErr });
    } else {
      res.status(200).send({ success: stripeRes });
    }
  });
});
```

5. Rework shop page to load data
6. move directory data to DB 
