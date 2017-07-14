import React from 'react';
import { InputGroup, Button, FormGroup } from 'react-bootstrap';
import axios from 'axios';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import SearchResultsTable from '../components/searchResultsTable.jsx';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      allowNew: false,
      multiple: false,
      options: [],
      searchResults: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.selectSmallTile = this.selectSmallTile.bind(this);
  }

  handleSearch(query) {
    axios.post('/api/search', {
      movieName: query
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
      })
      .catch(err => console.error('Error with search:', err));
  }

  selectSmallTile(e, evt, movie) {
    console.log('Selecting: ', movie);
  }

  renderMenuItemChildren(option) {
    return (
      <span>{option}</span>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h3>
            Search
          </h3>
        </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div>
                    <FormGroup>
                      <InputGroup>
                        <InputGroup.Addon>
                          Movie name
                        </InputGroup.Addon>
                        <AsyncTypeahead
                          options={this.state.options}
                          onSearch={this.handleSearch}
                          placeholder="Type in a movie you love"
                          renderMenuItemChildren={this.renderMenuItemChildren}
                        />
                        <InputGroup.Button>
                          <Button onClick={this.handleSearch}>Go</Button>
                        </InputGroup.Button>
                      </InputGroup>
                    </FormGroup>
                </div>
              </div>
            </div>
          </div>
        <div className="row">
          <div>
            <SearchResultsTable
              selectSmallTile={this.selectSmallTile}
              movies={this.state.searchResults}
            />
          </div>
        </div>
      </div>
    );
  }
  
}

export default Search;


/*

<InputGroup.Button>
  <DropdownButton
    title="Dropdown"
    id="bg-vertical-dropdown-1"
    onSelect={this.handleDropDownSelect}
  >
    <MenuItem eventKey="Movie">Movie</MenuItem>
    <MenuItem eventKey="Genre">Genre</MenuItem>
    <MenuItem eventKey="Director">Director</MenuItem>
    <MenuItem eventKey="Actor">Actor</MenuItem>
  </DropdownButton>
</InputGroup.Button>

*/
