const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const axios = require("axios");
const redis = require("redis");

const redisClient = redis.createClient(6379);
redisClient.connect();
redisClient.on("error", (error) => {
  console.error(error);
});
app.use(cors());

const photosRedis = async (req, res, next) => {
  const data = await redisClient.get("photos");
  if (data) {
    res.send(JSON.parse(data));
  } else {
    next();
  }
};

app.get("/pic", photosRedis, async (req, res) => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/photos"
  );
  //   await redisClient.connect();
  await redisClient.set("photos", JSON.stringify(data), { EX: 10 });
  res.send(data);
});

app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
