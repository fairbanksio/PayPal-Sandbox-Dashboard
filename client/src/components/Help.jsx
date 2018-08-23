import React from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: null };
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <TabContainer>
        <div className={classes.root}>
          <h3>Help & FAQ's</h3>
          <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Dashboard FAQs</Typography>
              <Typography className={classes.secondaryHeading}>Need help getting this app up and running?</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                maximus est, id dignissim quam.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>PayPal Sandbox FAQs</Typography>
              <Typography className={classes.secondaryHeading}>
                Need help with test payments in the PayPal Sandbox?
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                To get started, with test payments in the PayPal Sandbox, you will need to provide a <pre>Client ID</pre> and <pre>Secret</pre> for the PayPal REST SDK.
                <b>These details are not saved on the server at any point</b>, but stored within the browser and securely transmitted between you and PayPal.
                For help getting setup, please checkout the setup instructions below:
                <ul>
                  <li>Create a PayPal Developer account at <a href='https://developer.paypal.com/' target='_blank'>Developer.PayPal.com</a></li>
                  <li>First, create a new Sandbox merchant account. Be sure to create a Business account and might as well pre-fill it with test money (we'll use it for testing).</li>
                  <li>Once signed in, navigate to <i>My Apps & Credentials</i> and Create a New REST API App</li>
                  <li>Provide app details such as the name and the associated account. Once done, click <i>Create App</i></li>
                  <li>Take note of the <pre>Client ID</pre> & <pre>Secret</pre> and store them somewhere safe. These are the keys to paymenst with your Sandbox PayPal account!</li>
                  <li>Use the newly generated credentials on the <a href='/getting-started' target='_blank'>Getting Started</a> page.</li>
                  <li>Finally, <a href='/sale-payments' target='_blank'>go test some payments!</a></li>
                </ul>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <br/>
          <span>For Help with App Bugs: <a href='https://github.com/Fairbanks-io/PayPal-Sandbox-Dashboard/issues'>Open an Issue on GitHub</a></span>
          <br/>
          <span>For Help with PayPal Bugs: <a href='https://www.paypal-techsupport.com/'>Contact PayPal Technical Support</a></span>
        </div>
      </TabContainer>
    );
  }
}

Help.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Help);