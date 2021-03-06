
var React = require('react')
  , PT = React.PropTypes

  , Listener = require('./listener')
  , LoginForm = require('./login-form')

var Syncer = React.createClass({
  mixins: [Listener({
    listen: function (events) {
      return [
        events.syncing(),
        events.syncedPeople(),
        events.loggedIn()]
    },

    getState: function (getters) {
      return {
        isSyncing: getters.isSyncing(),
        isLoggedIn: getters.isLoggedIn(),
        syncedPeople: getters.syncedPeople(),
      }
    },

    onUpdate: function () {
      if (this.state.isLoggedIn && this.state.showLogin) {
        this.setState({
          showLogin: false
        }, () => this._onSync())
      }
    },
  })],

  propTypes: {
    store: PT.object,
  },

  getInitialState: function () {
    return {
      login: false,
    }
  },

  _onSync: function () {
    if (!this.state.isLoggedIn) {
      return this.setState({
        showLogin: true
      })
    }
    this.props.store.actions.startSyncing()
  },

  _onLogin: function (username, password) {
    this.props.store.actions.login(username, password)
  },

  render: function () {
    if (this.state.isSyncing) {
      return <div className="Syncer Syncer-syncing">
        Loading stories... {this.state.syncedPeople > 1 ? this.state.syncedPeople + ' people' : ''}
      </div>
    }
    if (this.state.showLogin) {
      return <div className="Syncer-login Syncer">
        <LoginForm onLogin={this._onLogin} />
      </div>
    }
    return <div className="Syncer" onClick={this._onSync}>
      Load stories
    </div>
  }
})

module.exports = Syncer

