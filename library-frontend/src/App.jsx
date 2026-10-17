import {
  useApolloClient,
  useSubscription,
} from '@apollo/client/react'
import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book added: "${addedBook.title}" by ${addedBook.author.name}`)

      const includedAs = (set, object) => {
        return set.map(b => b.id).includes(object.id)
      }

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        if (includedAs(allBooks, addedBook)) {
          return { allBooks }
        }

        return {
          allBooks: allBooks.concat(addedBook),
        }
      })
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommend show={page === 'recommend'} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setError={setErrorMessage}
        setPage={setPage}
      />
    </div>
  )
}

export default App