import React from 'react';
import { InputGroup, Button, FormGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import SearchResultsTable from '../components/searchResultsTable.jsx';
import LargeMovieTile from '../components/largeMovieTile.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const subHeader = `Tell FLIQ about movies you love or hate.
  If you've seen a movie but don't feel strongly about it, simply mark that you've seen it.`;

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      allowNew: false,
      multiple: false,
      options: [],
      searchString: 'star wars',
      searchResults: [],
      selectedMovie: null
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.selectSmallTile = this.selectSmallTile.bind(this);
  }

  componentDidMount() {
    this.handleSearch('star wars');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.searchString === nextState.searchString;
  }

  handleSearch() {
    this.setState({
      searchResults: [],
      selectedMovie: null
    });
    axios.post('/api/search', {
      movieName: this.state.searchString
    })
      .then(results => {
        console.log('Received: ', results.data);
        const autoCompleteStrings =
          results.data.map(movie =>
            `${movie.title} (${movie.year})`
          );
        this.setState({
          searchResults: results.data,
          options: autoCompleteStrings
        });
        this.selectSmallTile(null, null, results.data[0]);
      })
      .catch(err => console.error('Error with search:', err));
  }

  handleInputChange(e) {
    this.setState({ searchString: e.target.value });
  }

  handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  }

  selectSmallTile(e, evt, movie) {
    console.log('Selecting: ', movie);
    axios.post('/api/movie/select', {
      movie
    })
    .then((results) => {
      console.log('selectSmallTile receied: ', results.data);
      this.setState({ selectedMovie: results.data });
    })
    .catch(err => console.error(err));
  }

  render() {
    const largeTile = this.state.selectedMovie
      ? <LargeMovieTile movie={this.state.selectedMovie} />
      : null;

    return (
      <div ref={(el) => { this.mainTile = el; }} className="container fadeIn">
        <div>
          <h3>
          </h3>
          <h4>{subHeader}</h4>
        </div>
        <div>
          <FormGroup>
            <InputGroup>
              <InputGroup.Addon>
                Movie name
              </InputGroup.Addon>
              <FormControl
                type="text"
                placeholder={`A movie you love, e.g. "star wars"`}
                onChange={this.handleInputChange}
                onKeyPress={e => this.handleInputKeyPress(e)}
              />
              <InputGroup.Button>
                <Button onClick={this.handleSearch}>Search!</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </div>
        <div>
          <ReactCSSTransitionGroup
            transitionName="tileFade"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            <SearchResultsTable
              selectSmallTile={this.selectSmallTile}
              movies={this.state.searchResults}
            />
            {largeTile}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

export default Search;


/*
    <div>
            <SearchResultsTable
              selectSmallTile={this.selectSmallTile}
              movies={this.state.searchResults}
            />
          {largeTile}
        </div>
*/
