const mongoose = require("mongoose");

// Trade off between query performance and consistency

// Using References (Normalization) -> Consistency
let author = {
  name: "Mussa",
};

let course = {
  author: "id",
};

// Using Embedded Documents (Denormalization) -> Performance

let couse = {
  author: {
    name: "Mussa",
  },
};

// Hybrid Approach

let hybridAuthor = {
  name: "Mussa",
};

let hybridCourse = {
  author: {
    id: "ref",
    name: "Mussa",
  },
};

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  })
);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    // USING REFERENCES
    // author: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Author",
    // },
    // USING EMBEDDING
    // author: Author,
    // ARRAY OF SUB-AUTHORS
    authors: [Author],
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find()
    .populate("author", "name -_id")
    .select("name author");
  console.log(courses);
}

async function updateAuthor(courseId) {
  // const course = await Course.findById(courseId);

  // course.author.name = "Mussa";

  // const result = await course.save();
  // console.log(result);

  // MODIFYING
  const course = await Course.update(
    { _id: courseId },
    {
      $set: {
        "author.name": "John Smith",
      },
    }
  );
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  const result = await course.save();
  console.log(result);
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  // course.authors = course.authors.filter(
  //   (author) => author._id!= authorId
  // );
  const author = course.authors.id(authorId);
  author.remove();
  const result = await course.save();
  console.log(result);
}

async function rentMovie() {
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      year: movie.year,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (error) {
    res.status(500).send("Something failed.");
  }
}

// OBJECT ID
//_id: 5a724953ab83547957541e6a

// 12 bytes
// 4 bytes : timestamp
// 3 bytes : machine identifier
// 2 bytes : process identifier
// 3 bytes : counter

// 1 byte = 8 bits
// 2 ^ 8 = 256
// 2 ^ 24 = 16M

// ID is Generated by: Driver -> MongoDB

const id = new mongoose.Types.ObjectId();
console.log(id);
console.log(id.getTimestamp());

const isValid = mongoose.Types.ObjectId.isValid("1234");