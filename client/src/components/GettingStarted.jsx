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
              style={{marginRight: '30px'}}
            />
            <br/>
            <TextField
              id="clientSecret"
              label="Secret"
              type="search"
              className={classes.textField}
              margin="normal"
            />
            <br/><br/>
            <Button variant="outlined" color="primary" className={classes.button}>
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
