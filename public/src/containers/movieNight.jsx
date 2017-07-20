import React from 'react';
import axios from 'axios';
import { Button, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import LargeMovieTile from '../components/largeMovieTile.jsx';
import ResultsTileBar from '../components/resultsTileBar.jsx';

const subHeader = `FLIQ's recommendation engine can aggregate several people's preferences to suggest 
  movies that the group may enjoy. Enter other users' email addresses below and search for movies to watch.`;
let count = 0;

class MovieNight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmText: '',
      confirmClass: '',
      inputText: '',
      emails: [],
      searchResults: null,
      selectedMovie: null
    };
    this.searchEmail = this.searchEmail.bind(this);
    this.clearEmails = this.clearEmails.bind(this);
    this.removeEmail = this.removeEmail.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getResults = this.getResults.bind(this);
  }

  getResults() {
    axios.post('/api/movienight', {
      emails: this.state.emails
    })
      .then((results) => {
        console.log('Received: ', results.data);
        this.setState({
          searchResults: results.data,
          selectedMovie: results.data[0]
        });
      })
      .catch(err => console.error('Error getting results: ', err));
  }

  searchEmail() {
    axios.post('/api/user/email/verify', {
      email: this.state.inputText
    })
      .then((results) => {
        if (results.data.success) {
          const { name, email, id } = results.data.user;
          const userEmailObj = { name, email, id };
          const isAlreadyAdded = this.state.emails.some((obj) => {
            return obj.email === userEmailObj.email;
          });
          if (isAlreadyAdded) {
            this.setState({
              confirmText: 'You already added that user! :)',
              confirmClass: 'movienight-email-failure'
            });
          } else {
            const newEmailsArray = this.state.emails.slice();
            newEmailsArray.unshift(userEmailObj);
            this.setState({
              emails: newEmailsArray,
              confirmText: 'User added!',
              confirmClass: 'movienight-email-success'
            });
          }
        } else {
          this.setState({
            confirmText: `Whoops! We don't have any users with that email.`,
            confirmClass: 'movienight-email-failure'
          });
        }
        this.clearConfirmText();
      })
      .catch(err => console.error('Error searching for email: ', err));
  }

  removeEmail(e) {
    const newEmailsArray =
      this.state.emails
        .slice()
        .filter(userObj => !e.target.innerText.includes(userObj.email));
    this.setState({
      emails: newEmailsArray
    });
  }

  clearEmails() {
    this.setState({ emails: [] });
  }

  handleInputChange(e) {
    this.setState({
      inputText: e.target.value
    });
  }

  clearConfirmText() {
    setTimeout(() => {
      const newClass = `${this.state.confirmClass} fadeOut`;
      this.setState({
        confirmClass: newClass
      });
    }, 3000);
  }

  render() {
    const emails = this.state.emails.map(emailObj =>
      (<div
        key={count += 1}
        onDoubleClick={this.removeEmail}
      >
        {emailObj.name} ({emailObj.email})
      </div>));

    const largeTile = this.state.selectedMovie
      ? <LargeMovieTile movie={this.state.selectedMovie} />
      : null;

      const tileBar = this.state.searchResults
        ? <div className="fadeIn"><ResultsTileBar movies={this.state.searchResults} /></div>
        : null;

    return (
      <div className="container fadeIn">
        <div className="row">
          <div className="col-sm-12">
            <h4>{subHeader}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-5">
            <div className="row email-inputs">
              <div className="col-sm-12 email-input-box">
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Addon>
                      Email Address
                    </InputGroup.Addon>
                    <FormControl
                      type="email"
                      onChange={this.handleInputChange}
                      placeholder="Enter a user's email address"
                    />
                    <InputGroup.Button className="email-input-button">
                      <Button onClick={this.searchEmail}>Search</Button>
                    </InputGroup.Button>
                  </InputGroup>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 email-box">
                <div className="email-input-list">
                  {emails}
                </div>
              </div>
            </div>         
            <div className="row">
              <div >
                <button
                  className="btn btn-default btn-primary col-sm-5 pull-left fliq-button"
                  onClick={this.clearEmails}
                >
                  Clear Emails
                </button>
                <button
                  className="btn btn-default btn-primary col-sm-5 pull-right fliq-button"
                  onClick={this.getResults}
                >
                  Get Movies!
                </button>
              </div>
            </div>
            <div className="row">
              <span className="movienight-confirm-box">
                <span className={this.state.confirmClass}>
                  {this.state.confirmText}
                </span>
              </span>
            </div>
          </div>
          {largeTile}
          {tileBar}
        </div>
      </div>
    );
  }
}

export default MovieNight;
