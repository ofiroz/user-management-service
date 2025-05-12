import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import UserManagement from './components/UserManagement';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <UserManagement />
      </div>
    </ApolloProvider>
  );
}

export default App; 