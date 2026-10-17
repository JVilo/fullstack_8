import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_BOOKS, ALL_AUTHORS, ADD_BOOK } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')

    try {
      await createBook({
        variables: {
          title,
          author,
          published: parseInt(published),
          genres
        }
      })

      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')
    } catch (error) {
      console.log('Error creating book:', error)
    }
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <form onSubmit={submit}>
        <div>
          <label>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            published
            <input
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            genre
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
          </label>
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
  )
}

export default NewBook