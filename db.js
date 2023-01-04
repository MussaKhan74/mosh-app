const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("DB CONNECTED"))
  .catch((error) => console.log(error));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "networks"],
    lowercase: true,
    // uppercase: true,
    trim: true,
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      // ASYNC VALIDATOR
      isAsync: true,
      validator: function (v, callback) {
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },

      // NORMAL VALIDATOR
      // validator: function (v) {
      //   return v && v.length > 0;
      // },
      message: "Please add at least one tag",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 100,
    get: (v) => Math.round(v), // read a property from db
    set: (v) => Math.round(v), // set/save a property in db
  },
});

const Course = mongoose.model("Course", courseSchema);

// Create Document(Row) in Course Collection(Table)
async function createCourse() {
  try {
    const course = new Course({
      name: "Node.js",
      author: "Mussa",
      tags: ["node", "backend"],
      isPublished: true,
    });

    const result = await course.save();
    console.log(result);
  } catch (err) {
    for (fields in err.errors) console.log(err.errors[fields].message);
  }
}

createCourse();

// Query / Retrieve Documents in Course Collection

async function getCourse() {
  const courses = await Course.find();
  //   Filter
  const filteredCourses = await Course.find({
    author: "Mussa",
    isPublished: true,
  });
  const otherFilteredCourses = await Course.find({
    author: "Mussa",
    isPublished: true,
  })
    .limit(10)
    .sort({ name: 1 }) // 1 is for ascending order | -1 for descending order
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourse();

async function compareCourses() {
  // Comparison Query Operators

  // eq (equals)
  // ne (not equals)
  // lt (less than)
  // lte (less than or equal to)
  // gt (greater than)
  // gte (greater than or equal to )
  // in
  // nin (not in)

  const courses = await Course
    // .find({ price: { $gt: 10, $lte: 20 } })
    .find({ price: { $in: [10, 15, 20] } })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

async function logicalCourses() {
  // Logical Query Operators
  // or
  // and

  const courses = await Course.find()
    .or([{ author: "Mussa" }, { isPublished: true }]) // either one is true
    .and([{ author: "Mussa" }, { isPublished: true }]) // both needs to true
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

async function regularCourses() {
  // Regular Expressions

  // Starts with Mussa

  const courses = await Course.find({ author: /^Mussa/ }) // Starts with Mussa | case sensitive
    .find({ author: /Shaukat$/ }) // End with Mussa | case sensitive
    .find({ author: /Shaukat$/i }) // End with Mussa | case insensitive
    .find({ author: /.*Mussa.*/i }) // Contains | case insensitive | case insensitive
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

async function countCourses() {
  // Count Documents in a Collecitons

  const courses = await Course.find({ author: /^Mussa/ }) // Starts with Mussa | case sensitive
    .limit(10)
    .sort({ name: 1 })
    .count();
  console.log(courses);
}

async function paginateCourses() {
  // Paginations
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find({ author: "Mussa", isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

async function updateCourse(id) {
  // Approach: Query First
  // findById()
  // Modify its properties
  // save()

  const course = await Course.findById(id);
  if (!course) return;
  // Method 1
  course.isPublished = true;
  course.author = "Another Author";

  const result = await course.save();
  console.log(result);

  // Method 2
  course.set({
    isPublished: true,
    author: "Another Author",
  });

  // Approach: Update first
  // Update directly
  // Optionally: get the updated document
  // new: true | is used to get the new updated document

  const UpdateCourse = await Course.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        isPublished: true,
        author: "Another Author",
      },
    },
    { new: true }
  );
}

async function removeCourse(id) {
  // instead of deleteOne we can also use findByIdAndRemove
  // deleteOne will find and delete the first one only if we pass another filter instead of _id
  // deleteMany is used to delete many

  const result = await Course.deleteOne({ _id: id });
  console.log(result);
}
