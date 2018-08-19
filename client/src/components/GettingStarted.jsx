import React from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

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

class GettingStarted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientID: "",
      clientSecret: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // Save text value changes to state
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    // Write state to local storage on submit
    localStorage.setItem("clientID", this.state.clientID);
    localStorage.setItem("clientSecret", this.state.clientSecret);
    event.preventDefault();
  }

  render() {
    const { classes } = this.props;
    return (
      <TabContainer>
        <div>
            <h4>Getting Started in the PayPal Sandbox</h4>
            <TextField
              id="clientID"
              label="Client ID"
              type="search"
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange}
              style={{width: '500px'}}
            />
            <br/>
            <TextField
              id="clientSecret"
              label="Secret"
              type="search"
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange}
              style={{width: '500px'}}
            />
            <br/><br/>
            <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleSubmit}>
              Save
            </Button>
          </div>
      </TabContainer>
    );
  }

}
GettingStarted.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GettingStarted);