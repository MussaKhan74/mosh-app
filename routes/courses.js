const express = require("express");
const router = express.Router();

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", (req, res) => {
  res.send("Hello, world!");
});

router.get("/", (req, res) => {
  res.send(courses);
});

router.post("/", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error["message"]);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

router.put("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) {
    // 404
    return res.status(404).send("The Course with given ID is not available!");
  }

  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error["message"]);
  }

  // Update course
  course.name = req.body.name;
  // Return the updated course
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

router.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    // 404
    return res.status(404).send("The Course with given ID is not available!");
  }

  res.send(course);
});

router.delete("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) {
    // 404
    return res.status(404).send("The Course with given ID is not available!");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

module.exports = router;
