const express = require('express');
const app = express();
const { Client } = require('pg');
// const client = new Client({ database: "reservas" });

//Public folder
app.use(express.static('public'));
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const connectionData = {
  user: 'postgres',
  host: 'localhost',
  database: 'reservas',
  password: 'pokemona11',
  port: 5432,
}

const client = new Client(connectionData)

const fetchRestaurants = async () => {
  await client.connect();
  const res = await client.query("select * from restaurants");
  await client.end();

  return res.rows
}

const insertRestaurants = async (name, longitude, latitude) => {
  await client.connect()
  const text = 'INSERT INTO restaurants (id, name, lat, long) VALUES($1, $2, $3, $4)'
  const values = [111, name, longitude, latitude];
  try {
    await client.query(text, values);
    await client.end()
  } catch (error) {
    console.log(error.stack);
  }
}

const insertUser = async (email, name) => {
  await client.connect()
  const text = 'INSERT INTO users (id, email, name) VALUES($1, $2, $3)'
  const values = [111, email, name];
  try {
    await client.query(text, values);
    await client.end()
  } catch (error) {
    console.log(error.stack);
  }
}

const insertBooking = async (restaurant, user, guest) => {
  await client.connect()
  const text = 'INSERT INTO bookings (id, restaurant_id, user_id, guests) VALUES($1, $2, $3, $4)'
  const values = [111, restaurant, user, guest];
  try {
    await client.query(text, values);
    await client.end()
  } catch (error) {
    console.log(error.stack);
  }
}
app.get('/restaurants', async (req, res) => {
  const response = await fetchRestaurants();
  res.json(response)
});

app.post('/restaurants', (req, res) => {
  console.log("Post");
  insertRestaurants(req.query.name, req.query.long, req.query.lat);
  res.send("ok")
});

app.post('/user', (req, res) => {
  console.log("Post");
  insertUser(req.query.email, req.query.name);
  res.send("ok")
});

app.post('/booking', (req, res) => {
  console.log("Post");
  insertBooking(req.query.restaurant, req.query.user_id, req.query.guest);
  res.send("ok")
});

app.get('/booking', async (req, res) => {
  await client.connect();
  const result = await client.query("SELECT, FROM table1 JOIN table2 ON  table1.column1 = table2.column2select * from bookings");
  await client.end();

  res.json(result.rows)
})

app.listen(3001);
