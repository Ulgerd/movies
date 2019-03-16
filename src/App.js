import React, { Component } from 'react';
import './App.css';

const API = 'https://api.themoviedb.org/3/discover/movie?api_key=b8dc645cd0d0f3b0e3b94f9a809369fc&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page='
const IMG = 'http://image.tmdb.org/t/p/w154'


class List extends Component {

  onClick = () => {
    this.props.onClick(this.props.title)
  }

  render() {
    let films = this.props.movies.map(key =>
      <div key={key.id}>
        <img
          src ={`${IMG}${key.backdrop_path}`}
          alt={'just use your imagination'}
          width='100'
        />
        <div>Title: {key.original_title}</div>
        <div>Score: {key.vote_average} / 10</div>
        <div>Overview: {key.overview}</div>
      </div>)

    return (
      <div>
        <h2>{this.props.title}</h2>
        {films}
        <button
          type='button'
          onClick = {this.onClick}
        >Next 20
        </button>
      </div>
    )
  }
}

class App extends Component {

  state = {
    data: {
      topFilms: {
        movies: [],
        page: 1,
        genre: '',
        title: 'Trending Now'
      },
      sciFi: {
        movies: [],
        page: 1,
        genre: '&with_genres=878',
        title: 'Sci-Fi Hits'
      },
      comedy: {
        movies: [],
        page: 1,
        genre: '&with_genres=35',
        title: 'Comedy Hits'
      }
    },
    error: null
  }

  componentDidMount() {
    Object.keys(this.state.data).map(category => {
      this.getNewData(category)
      return null;
    })
  }

getNewData = async (category) => {
  try {
    let res = await fetch(API+
      this.state.data[category].page+
      this.state.data[category].genre)
    let movies = await res.json();
    this.setState({
      data: { ...this.state.data,
      [category]: {
        ...this.state.data[category],
        movies: [
          ...this.state.data[category].movies,
          ...movies.results]}
        }
      })
  } catch(e) {
    this.setState({
      error: e,
    })
  }
}

showMoreMovies = (title) => {
  Object.keys(this.state.data).map(async key => {
    if (this.state.data[key].title === title) {
      await this.setState({
        data: {
          ...this.state.data,
          [key]: {
          ...this.state.data[key],
          page: this.state.data[key].page+1}
      }
    })
      await this.getNewData(key)
    }
  })
}

  render() {
    let {data, error} = this.state;

    if (error) {
      return <p>{error.message}</p>
    }

    let listsOfMovies = Object.keys(data).map( key =>
      <List
        key ={data[key].title}
        title={data[key].title}
        movies={data[key].movies}
        onClick={this.showMoreMovies}/> )
    return (
      <div className="App" >
          {listsOfMovies}
      </div>
    );
  }
}

export default App;
