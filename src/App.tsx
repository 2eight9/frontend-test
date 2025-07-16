import React from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import PostList from './components/PostList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Banner />
      <PostList />
    </div>
  );
}

export default App;