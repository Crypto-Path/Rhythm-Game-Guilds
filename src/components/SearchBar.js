import * as React from 'react';
import { apiCall } from '../functions/apiCall';

export const SearchBar = ({query = "ARG", onChange}) => {
  const [searchText, setSearchText] = React.useState('');
  const [results, setResults] = React.useState('');
  //const foundVideos = filterVideos(videos, searchText);

  React.useEffect(() => {
    const getResults = async () => {
        const tempResults = await apiCall(url);
        setResults(tempResults);
    };

    getResults();
  }, []);

    const url = `https://api.quavergame.com/v1/users/search/${query}`;
     

    console.log(results)

  return (
    <>
      <div>bar</div>
    </>
  );
}