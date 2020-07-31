import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

import React from 'react';
import {render} from 'react-dom';

const client = new ApolloClient({
  uri: 'https://localhost:4000/api',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>Outline Proof of Concept</h2>
      </div>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById('root'));
