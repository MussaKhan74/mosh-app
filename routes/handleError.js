const router = require("express").Router();
const asyncMiddleware = require("../middleware/async");

// router.get(
//   "/",
//   asyncMiddleware(async (req, res) => {
//     const genres = await Genre.find().sort("name");
//     res.send(genres);
//   })
// );

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});
