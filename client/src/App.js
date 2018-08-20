import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PayPalPayments from "./components/PayPal-Payments.jsx";
import GettingStarted from "./components/GettingStarted.jsx";
import BillingAgreements from "./components/BillingAgreements.jsx";
import TransactionReports from "./components/TransactionReports.jsx";
import Help from "./components/Help.jsx";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
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
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
    console.log(value);
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <Router>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={this.handleChange}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Getting Started" icon={<i className="fab fa-2x fa-paypal"/>} component={Link} to="/getting-started" />
              <Tab label="Sale Payments" icon={<i className="fas fa-2x fa-dollar-sign"/>} component={Link} to="/payments" />
              <Tab label="Billing Agreements" icon={<i className="far fa-2x fa-calendar-check"/>} component={Link} to="/agreements"/>
              <Tab label="Transaction Reports" icon={<i className="far fa-2x fa-chart-bar"/>} component={Link} to="/transaction-reports"/>
              <Tab label="Help & FAQs" icon={<i className="fas fa-2x fa-question-circle"/>} component={Link} to="/help"/>
            </Tabs>
          </AppBar>
          <Route path="/getting-started" component={GettingStarted} />
          <Route path="/payments" component={PayPalPayments} />
          <Route path="/agreements" component={BillingAgreements} />
          <Route path="/transaction-reports" component={TransactionReports} />
          <Route path="/help" component={Help} />
          <Route exact path="/" component={GettingStarted} />
        </div>
      </Router>
    );
  }
}

ScrollableTabsButtonForce.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonForce);
