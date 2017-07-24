import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import DashboardUserProfile from '../components/dashboardUserProfile.jsx';
import PieChart from '../components/pieChart.jsx';
import BarChart from '../components/barChart.jsx';
import ToggleSwitch from '../components/toggleSwitch.jsx';
import { setUserReViewSetting, toggleUserReViewSetting } from '../actions/actions.js';

const tagsCountCutoff = 10;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // raw data for charts
      userInfo: null,
      userMoviesInfo: null,
      userTagsInfo: null,
      tagsTableData: null,

      // chart data for most selected tags based on absolute number
      topTagIdsByUser: null,
      topTagsByName: null,
      topTagPicksCountsByUser: null,

      // chart data for most selected tags based on percentage
      mostSelectedTagIds: null,
      mostSelectedTagNames: null,
      mostSelectedTagPercentages: null,

      // chart data for most liked actors

    }

    this.getUserInfo = this.getUserInfo.bind(this);
    this.getTableData = this.getTableData.bind(this);
    this.updateUserReViewSetting = this.updateUserReViewSetting.bind(this);
    this.changeUserReViewSetting = this.changeUserReViewSetting.bind(this);
    this.chartTopTagsByUser = this.chartTopTagsByUser.bind(this);
    this.chartTopActorsByLikes = this.chartTopActorsByLikes.bind(this);
  }

  componentWillMount() {
    this.getUserInfo();
  }


  getUserInfo() {
    return axios.post('/api/dashboard/userInfo', {
      id: this.props.auth.user.id
    })
    .then((responseObj) => {
      this.setState({
        userInfo: responseObj.data.userInfo,
        userMoviesInfo: responseObj.data.userMoviesInfo,
        userTagsInfo: responseObj.data.userTagsInfo
      });

      // toggle switch for user reViewSetting
      const userReViewSetting = responseObj.data.userInfo.reView;
      this.props.setUserReViewSetting(userReViewSetting);
    })
    .then(() => {
      this.getTableData();
    });
  }

  getTableData() {
    return axios.get('/api/dashboard/tableData')
    .then((responseObj) => {
      console.log('responseObj is: ', responseObj.data);
      this.setState({
        tagsTableData: responseObj.data.tagsTableData
      });
    })
    .then(() => {
      this.chartTopTagsByUser();
    })
    .then(() => {
      this.chartTopTagsBySelectionPercentage();
    });
  }

  chartTopTagsByUser() {
    const tagPicksCountCutoff = tagsCountCutoff;
    const tagIds = [];
    const tagPicksCounts = [];
    const tagNames = [];

    this.state.userTagsInfo.forEach((tagObj) => {
      if (tagObj.picksCount > tagPicksCountCutoff) {
        tagIds.push(tagObj.tag_Id);
        tagPicksCounts.push(tagObj.picksCount);
      }
    });

    tagIds.forEach((tagId) => {
      this.state.tagsTableData.forEach((tagObj) => {
        if (tagId === tagObj.id) {
          tagNames.push(tagObj.tagName);
        }
      });
    });

    this.setState({
      topTagIdsByUser: tagIds,
      topTagPicksCountsByUser: tagPicksCounts,
      topTagsByName: tagNames
    });
  }

  chartTopTagsBySelectionPercentage() {
    const tagPicksCountCutoff = tagsCountCutoff;
    const tagIds = [];
    const tagSelectionPercentages = [];
    const tagNames = [];

    this.state.userTagsInfo.forEach((tagObj) => {
      if (tagObj.picksCount > tagPicksCountCutoff) {
        tagIds.push(tagObj.tag_Id);
        tagSelectionPercentages.push(tagObj.picksCount / tagObj.viewsCount);
      }
    });

    tagIds.forEach((tagId) => {
      this.state.tagsTableData.forEach((tagObj) => {
        if (tagId === tagObj.id) {
          tagNames.push(tagObj.tagName);
        }
      });
    });

    this.setState({
      mostSelectedTagIds: tagIds,
      mostSelectedTagNames: tagNames,
      mostSelectedTagPercentages: tagSelectionPercentages
    });
  }

  chartTopActorsByLikes() {

  }

  changeUserReViewSetting() {
    this.updateUserReViewSetting()
      .then(() => {
        this.props.toggleUserReViewSetting();
      });
  }

  updateUserReViewSetting() {
    return axios.post('/api/dashboard/updateUserSettings', {
      id: this.props.auth.user.id,
      reView: !this.props.userReViewSetting
    });
  }


  render() {
    console.log('In Dashboard render, props is: ', this.props);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <DashboardUserProfile
              user={this.props.auth.user}
            />
            <br />
            <ToggleSwitch
              changeUserReViewSetting={this.changeUserReViewSetting}
              reViewSetting={this.props.userReViewSetting}
            />
          </div>
        </div>
        <br />
        <div className="row">
          {this.state.topTagsByName && <PieChart
            labels={this.state.topTagsByName}
            data={this.state.topTagPicksCountsByUser}
          />}
          {this.state.mostSelectedTagNames && <BarChart
            labels={this.state.mostSelectedTagNames}
            data={this.state.mostSelectedTagPercentages}
          />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  userReViewSetting: state.userSettingsReducer.userReViewSetting
});

const mapDispatchToProps = dispatch => ({
  setUserReViewSetting: (userReViewSetting) => {
    dispatch(setUserReViewSetting(userReViewSetting));
  },
  toggleUserReViewSetting: () => { dispatch(toggleUserReViewSetting()); }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
