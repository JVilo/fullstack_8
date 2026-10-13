require('dotenv').config()
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const initialUsers = [
  { username: "mluukkai", favoriteGenre: "refactoring" },
  { username: "tester", favoriteGenre: "agile" },
]

const initialAuthors = [
  { name: "Robert Martin", born: 1952 },
  { name: "Martin Fowler", born: 1963 },
  { name: "Fyodor Dostoevsky", born: 1821 },
  { name: "Joshua Kerievsky" },
  { name: "Sandi Metz" },
]

const initialBooks = [
  {
    title: "Clean Code",
    published: 2008,
    authorName: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    authorName: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    authorName: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    authorName: "Joshua Kerievsky",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    authorName: "Sandi Metz",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    authorName: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    authorName: "Fyodor Dostoevsky",
    genres: ["classic", "revolution"],
  },
]

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB for seeding...')

    await Book.deleteMany({})
    await Author.deleteMany({})
    await User.deleteMany({})

    await User.insertMany(initialUsers)
    const savedAuthors = await Author.insertMany(initialAuthors)

    const authorMap = {}
    savedAuthors.forEach(author => {
      authorMap[author.name] = author._id
    })

    const booksWithAuthorIds = initialBooks.map(book => ({
      title: book.title,
      published: book.published,
      genres: book.genres,
      author: authorMap[book.authorName],
    }))

    await Book.insertMany(booksWithAuthorIds)

    console.log('Database seeded successfully!')
    mongoose.connection.close()
  } catch (error) {
    console.error('Error seeding database:', error)
    mongoose.connection.close()
  }
}

seedDatabase()