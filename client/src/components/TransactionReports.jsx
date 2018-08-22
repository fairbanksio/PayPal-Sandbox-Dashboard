import React from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {UnControlled as CodeMirror} from 'react-codemirror2';
require('codemirror/mode/javascript/javascript');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

// MaterialUI Theme Options: https://material-ui.com/customization/themes/#theme-configuration-variables
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#83c3f7', // Light Blue
      contrastText: '#fff', // White
    },
    secondary: {
      main: '#a2cf6e', // Light Green (for Copied button)
      contrastText: '#fff', // White
    },
  },
});

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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class IpnList extends React.Component {
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
      this.props.ipns.length > 0 ? this.props.ipns.map(function(item, key) {
        return (
          <ExpansionPanel key={key} expanded={expanded === 'panel' + key} onChange={this.handleChange('panel' + key)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                {item.status == "VERIFIED"
                  ? <i className="far fa-check-circle" style={{
                      color: '#090',
                      paddingRight: '25px'
                    }}/>
                  : <i className="far fa-times-circle" style={{
                      color: '#D8000C',
                      paddingRight: '25px'
                    }}/>
                }
                <span style={{fontWeight: 375}}><b>Transaction ID: </b>{item.ipnMessage.txn_id}</span>
              </Typography>
              <Typography className={classes.secondaryHeading}>
                <span style={{fontWeight: 350}}>{moment(item.timestamp).format('ddd, MMM Do YYYY @ h:mm:ss A')}</span>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <div style={{ width: '31%'}}>
                  <Typography variant="caption">
                    <span style={{ paddingRight: '25px' }}><b>Payment Status: </b>{item.ipnMessage.payment_status}</span>
                    <span style={{ paddingRight: '25px' }}><b>IPN Status: </b>{item.status}</span>
                    <span style={{ paddingRight: '25px' }}><b>Buyer: </b>{item.ipnMessage.payer_email + ' (' + item.ipnMessage.payer_id + ')'}</span>
                    <span style={{ paddingRight: '25px' }}><b>Payment Amount: </b>{'$' + item.ipnMessage.mc_gross}</span>
                  </Typography>
                  <hr/>
                  <div>
                    <h4>IPN Message</h4>
                    <CodeMirror
                      ref='ipnMessage'
                      value={JSON.stringify(item.ipnMessage, null, ' ')}
                      options={{
                        lineNumbers: true,
                        mode: { name: 'javascript', json: true },
                        theme: 'material',
                        readOnly: 'nocursor' // Nocursor for proper mobile handling
                      }}
                      onChange={(editor, data, value) => {}}
                      preserveScrollPosition={true}
                    />
                  </div>
                  <br/>
                  <div>
                    <h4>IPN Postback</h4>
                    <CodeMirror
                      ref='ipnPostback'
                      value={JSON.stringify(item.ipnPostback, null, ' ')}
                      options={{
                        lineNumbers: true,
                        mode: { name: 'javascript', json: true },
                        theme: 'material',
                        readOnly: 'nocursor' // Nocursor for proper mobile handling
                      }}
                      onChange={(editor, data, value) => {}}
                      preserveScrollPosition={true}
                    />
                  </div>
                </div>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      }, this) : null
    );
  }
}

class TransactionReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ipnData: {},
      ipnCount: null,
      expanded: null,
    };
    this.getIpnData = this.getIpnData.bind(this);
    this.getIpnCount = this.getIpnCount.bind(this);
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  getIpnData() {
    fetch(`/api/ipnData`)
    .then(response => {
        return response.json()
      }).then(data => {
        if(data){
          this.setState({ ipnData: data });
        } else {
          this.setState({ ipnData: "Error Getting IPN Data" });
        }
        setTimeout
      })
  }

  getIpnCount() {
    fetch(`/api/ipnCount`)
    .then(response => {
        return response.json()
      }).then(data => {
        if(data){
          this.setState({ ipnCount: data });
        } else {
          this.setState({ ipnCount: "Error Getting IPN Count" });
        }
      })
  }

  componentDidMount() {
    this.getIpnData();
    this.getIpnCount();
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    return (
      <TabContainer>
        <h3>Transaction Reports</h3>
        {this.state.ipnData.length > 0
          ?<div>
            <IpnList {...this.props} ipns={this.state.ipnData}/>
            <br/>
            <Typography variant="caption">
              <i>{'Total Transactions: ' + this.state.ipnCount}</i>
            </Typography>
            <br/>
            <hr/>
            <br/>
            <h3>DB Collection:</h3>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}><b>IPN Collection Data</b></Typography>
                <Typography className={classes.secondaryHeading}><span style={{fontWeight: 350}}>Raw Database Response</span></Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  <hr/><br/>
                  <CodeMirror
                    ref='dbCollection'
                    value={JSON.stringify(this.state.ipnData, null, ' ')}
                    options={{
                      lineNumbers: true,
                      mode: { name: 'javascript', json: true },
                      theme: 'material',
                      readOnly: 'nocursor' // Nocursor for proper mobile handling
                    }}
                    onChange={(editor, data, value) => {}}
                    preserveScrollPosition={true}
                  />
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          :<CircularProgress className={classes.progress} size={50} />
        }
      </TabContainer>
    );
  }
}
TransactionReports.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionReports);