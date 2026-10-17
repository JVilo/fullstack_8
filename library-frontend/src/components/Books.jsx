import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data?.allBooks || []

  const allGenres = books.reduce((genres, book) => {
    const bookGenres = book.genres || []
    bookGenres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })
    return genres
  }, [])

  const filteredBooks = selectedGenre
    ? books.filter(book => (book.genres || []).includes(selectedGenre))
    : books

  return (
    <div>
      <h2>books</h2>

      {selectedGenre ? (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      ) : (
        <p>in all genres</p>
      )}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {allGenres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books