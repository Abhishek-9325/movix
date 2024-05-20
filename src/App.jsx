import { useState, useEffect } from 'react'
import { fetchDataFromApi } from './utils/api'
import { useDispatch, useSelector } from 'react-redux';
import { getApiConfiguration, getGenres } from './store/homeSlice';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/home/Home';
import SearchResult from './pages/searchResult/SearchResult';
import Details from './pages/details/Details';
import Explore from './pages/explore/Explore';
import PageNotFound from './pages/404/PageNotFound';
import Header from './components/header/Header';
import Footer from './components/Footer/Footer';

function App() {
  const dispatch = useDispatch();
  const {url} = useSelector(state => state.home);
  // console.log(url);

  useEffect(() => {
    fetchApiConfig();
    getGenresApi();
  }, [])
  

  const fetchApiConfig = ()=>{
    fetchDataFromApi('/configuration').then((res)=>{
      // console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + 'original',
        poster: res.images.secure_base_url + 'original',
        profile: res.images.secure_base_url + 'original',
      }
      dispatch(getApiConfiguration(url));
    })
  }

  const getGenresApi = async () => {
    const promises = [];
    const endpoints = ['tv', 'movie'];
    const allGenres = {};

    endpoints.forEach((endpoint) => {
      promises.push(fetchDataFromApi(`/genre/${endpoint}/list`));
    });

    const responses = await Promise.all(promises);
    console.log(responses);

    responses.map(({ genres }) => {
      return genres.map((genre) => (allGenres[genre.id] = genre));
    });

    //  console.log(allGenres);

    //  dispatch(getGenres(allGenres));
    dispatch(getGenres(allGenres));
  }


  return (
    (<BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/:mediaType/:id" element={<Details />}/>
      <Route path="/search/:query" element={<SearchResult />}/>
      <Route path="/explore/:mediaType" element={<Explore />}/>
      <Route path="*" element={<PageNotFound />}/>
    </Routes>
    <Footer/>
    </BrowserRouter>)
  )
}

export default App
