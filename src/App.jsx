import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import SignIn from './pages/SignIn';
import { auth } from './firebase';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  return (
    <>
      <Routes>
        <Route 
          path='/' 
          element={user ? <Home user={user}/> : <Navigate to='/signin' />} 
        />

        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <SignIn onSignIn={setUser} />}
        />

        <Route 
          path='/book/:bookId'
          element={<BookDetail user={user}/>}
        />

      </Routes>
    </>
  );
}

export default App;
