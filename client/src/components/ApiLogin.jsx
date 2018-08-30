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
import { Link } from "react-router-dom";

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // IE Sucks
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
    backgroundColor: '#005EA6', // PayPal Blue
  },
  form: {
    width: '100%', // IE Sucks
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class ApiLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientID: localStorage.getItem("clientID") || "",
      clientSecret: localStorage.getItem("clientSecret") || "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // Save text value changes to state
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    // Write state to Local Storage on Save
    if(this.state.clientID.length > 0 && this.state.clientSecret.length > 0){
      localStorage.setItem("clientID", this.state.clientID);
      localStorage.setItem("clientSecret", this.state.clientSecret);
      this.setState({ saved: true })
      this.props.onSubmit()
      event.preventDefault();
    } else {
      event.preventDefault();
    }
  }

  handleReset(event) {
    // Clear out the stored Client ID and Secret
    localStorage.removeItem("clientID");
    localStorage.removeItem("clientSecret");
    this.setState({ clientID: "", clientSecret: "", saved: false })
    this.props.onReset()
    event.preventDefault();
  }

  componentDidMount() {
    if(this.state.clientID.length > 0 && this.state.clientSecret.length > 0) {
      this.setState({ saved: true })
    }else {
      this.setState({ saved: false })
    }
  }

  render() {
    const { classes } = this.props;
    return (
        <React.Fragment>
          <CssBaseline />
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <i class="fab fa-paypal"/>
              </Avatar>
              <Typography variant="title" gutterBottom="true">Set API Credentials</Typography>
              <Typography variant="body1" align="center">A PayPal REST API Client ID and Secret are required in order to complete payments.</Typography>

              <form className={classes.form}>
                <FormControl margin="normal" required fullWidth disabled={this.state.saved}>
                  <InputLabel htmlFor="clientID">Client ID</InputLabel>
                  <Input
                    id="clientID"
                    name="clientID"
                    autoComplete="clientID"
                    autoFocus
                    onChange={this.handleChange}
                    value={this.state.clientID}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth disabled={this.state.saved}>
                  <InputLabel htmlFor="clientSecret">Secret</InputLabel>
                  <Input
                    name="clientSecret"
                    id="clientSecret"
                    autoComplete="clientSecret"
                    onChange={this.handleChange}
                    required={true}
                    value={this.state.clientSecret}
                  />
                </FormControl>
                {this.state.saved === true
                  ? <Button
                      type="submit"
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      className={classes.submit}
                      onClick={this.handleReset}
                    >
                      Reset
                    </Button>
                  : <Button
                      type="submit"
                      fullWidth
                      variant="outlined"
                      color="primary"
                      className={classes.submit}
                      onClick={this.handleSubmit}
                    >
                      Apply
                    </Button>
                }
              </form>
              <br />
              <Typography variant="caption" style={{alignItems: 'center'}}>
                For help getting started, please check out the &nbsp;
                <Link to='/help' style={{alignItems: 'center' }}>
                  <span style={{textDecoration: 'none' }}>Help and FAQs</span>
                </Link>
              </Typography>
            </Paper>
            <br />
            {this.state.saved === true
              ? <Link to='/payments' style={{ color: '#9E9E9E', textDecoration: 'none', display: 'flex',
                  flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.3em', marginBottom: '8px', color: '#9E9E9E', textDecoration: 'none' }}>Let's Get Started!</span>
                  <i className="far fa-lg fa-arrow-alt-circle-right"/>
                </Link>
              : null
            }
          </main>
        </React.Fragment>
    );
  }
}

ApiLogin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApiLogin);
