import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: '#005EA6' || theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
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
    console.log('Handling Change')
  }

  handleSubmit(event) {
    // Write state to Local Storage on Save
    localStorage.setItem("clientID", this.state.clientID);
    localStorage.setItem("clientSecret", this.state.clientSecret);
    event.preventDefault();
    console.log('Credentials Saved!')
  }

  render() {
    const { classes } = this.props;
    return (
      <TabContainer>
        <React.Fragment>
          <CssBaseline />
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <i class="fab fa-paypal"/>
              </Avatar>
              <Typography variant="headline">Set Credentials</Typography>
              <form className={classes.form}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="clientID">Client ID</InputLabel>
                  <Input id="clientID" name="clientID" autoComplete="clientID" autoFocus onChange={this.handleChange} />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="clientSecret">Secret</InputLabel>
                  <Input
                    name="clientSecret"
                    id="clientSecret"
                    autoComplete="clientSecret"
                    onChange={this.handleChange}
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  className={classes.submit}
                  onClick={this.handleSubmit}
                >
                  Save
                </Button>
              </form>
            </Paper>
          </main>
        </React.Fragment>
      </TabContainer>
    );
  }
}

GettingStarted.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GettingStarted);