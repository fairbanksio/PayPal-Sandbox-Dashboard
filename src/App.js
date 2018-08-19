import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

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
    width: 500,
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
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
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
            <Tab label="Getting Started" icon={<i className="fab fa-2x fa-paypal"/>} />
            <Tab label="Sale Payments" icon={<i className="fas fa-2x fa-dollar-sign"/>} />
            <Tab label="Billing Agreements" icon={<i className="far fa-2x fa-calendar-check"/>} />
            <Tab label="Transaction Reports" icon={<i className="far fa-2x fa-chart-bar"/>} />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
          <div>
            <h4>Getting Started in the PayPal Sandbox</h4>
            <TextField
              id="clientID"
              label="Client ID"
              type="search"
              className={classes.textField}
              margin="normal"
              style={{width: '500px'}}
            />
            <br/>
            <TextField
              id="clientSecret"
              label="Secret"
              type="search"
              className={classes.textField}
              margin="normal"
              style={{width: '500px'}}
            />
            <br/><br/>
            <Button variant="outlined" color="primary" className={classes.button}>
              Save
            </Button>
          </div>
        </TabContainer>}
        {value === 1 && <TabContainer>Sale Payments</TabContainer>}
        {value === 2 && <TabContainer>Billing Agreements</TabContainer>}
        {value === 3 && <TabContainer>Transaction Reports</TabContainer>}
      </div>
    );
  }
}

ScrollableTabsButtonForce.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonForce);
