import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import PayPalPayments from "./components/PayPal-Payments.jsx";
import GettingStarted from "./components/GettingStarted.jsx";
import BillingAgreements from "./components/BillingAgreements.jsx";
import TransactionReports from "./components/TransactionReports.jsx";
import Help from "./components/Help.jsx";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FAFAFA' || theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  input: {
    display: 'none',
  },
});

class ScrollableTabsButtonForce extends React.Component {
  state = {
    activeTab: '/getting-started',
  };

  constructor(props) {
    super(props);
    this.handleTab = this.handleTab.bind(this);
  }

  handleTab = (event, value) => {
    this.setState({ activeTab:value });
  };

  render() {
    const { classes } = this.props;
    const { activeTab } = this.state;
    return (
      <Router>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={activeTab}
              onChange={this.handleTab}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab value="/getting-started" label="Getting Started" icon={<i className="fab fa-2x fa-paypal"/>} component={Link} to="/getting-started" />
              <Tab value="/payments" label="Sale Payments" icon={<i className="fas fa-2x fa-dollar-sign"/>} component={Link} to="/payments" />
              <Tab value="/agreements" label="Billing Agreements" icon={<i className="far fa-2x fa-calendar-check"/>} component={Link} to="/agreements"/>
              <Tab value="/transaction-reports" label="Transaction Reports" icon={<i className="far fa-2x fa-chart-bar"/>} component={Link} to="/transaction-reports"/>
              <Tab value="/help" label="Help & FAQs" icon={<i className="fas fa-2x fa-question-circle"/>} component={Link} to="/help"/>
            </Tabs>
          </AppBar>
          <Switch>
            <Route path="/getting-started" render={routeProps => (<GettingStarted {...routeProps} tabChange={this.handleTab}/> )}/>
            <Route path="/payments" render={routeProps => (<PayPalPayments {...routeProps} tabChange={this.handleTab}/> )}/>
            <Route path="/agreements" render={routeProps => (<BillingAgreements {...routeProps} tabChange={this.handleTab}/> )}/>
            <Route path="/transaction-reports" render={routeProps => (<TransactionReports {...routeProps} tabChange={this.handleTab}/> )}/>
            <Route path="/help" render={routeProps => (<Help {...routeProps} tabChange={this.handleTab}/> )}/>
            <Route exact path="/" render={routeProps => (<GettingStarted {...routeProps} tabChange={this.handleTab}/> )}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

ScrollableTabsButtonForce.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonForce);
