import React from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import Divider from '@material-ui/core/Divider';
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
      main: '#3F51B5', // Purple-ish Blue
      contrastText: '#fff', // White
    },
    secondary: {
      main: '#090', // Success Green (for Copied button)
      contrastText: '#fff', // White
    },
  },
});

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
          <ExpansionPanel key={key} CollapseProps={{ unmountOnExit: true }} expanded={expanded === 'panel' + key} onChange={this.handleChange('panel' + key)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                {item.status === "VERIFIED"
                  ? <i className="far fa-check-circle" style={{
                      color: '#090',
                      paddingRight: '25px'
                    }}/>
                  : <i className="far fa-times-circle" style={{
                      color: '#D8000C',
                      paddingRight: '25px'
                    }}/>
                }
                <span style={{fontWeight: 375}}>
                  {item.ipnMessage.txn_id
                    ? <b>Transaction ID: </b>
                    : <b>Billing Agreement Created</b>
                  }
                  {item.ipnMessage.txn_id}
                </span>
              </Typography>
              <Typography className={classes.secondaryHeading}>
                <span style={{fontWeight: 350}}>{moment(item.timestamp).format('ddd, MMM Do YYYY @ h:mm:ss A')}</span>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <div style={{ width: '31%'}}>
                  <Typography variant="caption">
                    {item.ipnMessage.payment_status
                      ? <span style={{ paddingRight: '25px' }}><b>Payment Status: </b>{item.ipnMessage.payment_status}</span>
                      : null
                    }
                    {item.status
                      ? <span style={{ paddingRight: '25px' }}><b>IPN Status: </b>{item.status}</span>
                      : null
                    }
                    {item.ipnMessage.payer_email
                      ? <span style={{ paddingRight: '25px' }}><b>Buyer: </b>{item.ipnMessage.payer_email + ' (' + item.ipnMessage.payer_id + ')'}</span>
                      : null
                    }
                    {item.ipnMessage.mc_gross
                      ? <span style={{ paddingRight: '25px' }}><b>Payment Amount: </b>{'$' + item.ipnMessage.mc_gross}</span>
                      : null
                    }
                  </Typography>
                  <Divider/>
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
                    <br />
                    {this.state.copied
                      ? <Button onClick={this.copyJSON} size="small" variant="outlined" color="secondary" style={{ fontSize: 11 }}>
                          <i className="fas fa-check"></i>
                          <span style={{ marginLeft: 6 }}>Copied</span>
                        </Button>
                      : <CopyToClipboard text={JSON.stringify(this.state.ipnMessage, null, ' ')} onCopy={() => this.setState({copied: true})}>
                          <Button onClick={this.copyJSON} size="small" variant="outlined" color="primary" style={{ fontSize: 11 }}>
                            <i className="fas fa-copy"></i>
                            <span style={{ marginLeft: 6 }}>Copy JSON</span>
                          </Button>
                        </CopyToClipboard>
                    }
                  </div>
                  <br/><Divider/>
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
                    <br />
                    {this.state.copied
                      ? <Button onClick={this.copyJSON} size="small" variant="outlined" color="secondary" style={{ fontSize: 11 }}>
                          <i className="fas fa-check"></i>
                          <span style={{ marginLeft: 6 }}>Copied</span>
                        </Button>
                      : <CopyToClipboard text={JSON.stringify(this.state.ipnPostback, null, ' ')} onCopy={() => this.setState({copied: true})}>
                          <Button onClick={this.copyJSON} size="small" variant="outlined" color="primary" style={{ fontSize: 11 }}>
                            <i className="fas fa-copy"></i>
                            <span style={{ marginLeft: 6 }}>Copy JSON</span>
                          </Button>
                        </CopyToClipboard>
                    }
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
      copied: false
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

  copyJSON = () => {
    let _this = this;
    setTimeout(function(){ _this.setState({'copied' : false}); }, 4000);
  };

  componentDidMount() {
    this.getIpnData();
    this.getIpnCount();
    this.timer = setInterval(()=> this.getIpnData(), 10000);
    this.timer = setInterval(()=> this.getIpnCount(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <TabContainer>
          <h3>Transaction Reports</h3>
          {this.state.ipnData.length > 0
            ?<div style={{
              height: '100vh',
            }}>
              <IpnList {...this.props} ipns={this.state.ipnData}/>
              <br/>
              <Typography variant="caption">
                <i>{'Showing ' + this.state.ipnData.length + ' of ' + this.state.ipnCount + ' Transactions'}</i>
              </Typography>
              <br/><Divider/><br/>
              <h3>DB Collection:</h3>
              <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}><b>IPN Collection Data</b></Typography>
                  <Typography className={classes.secondaryHeading}><span style={{fontWeight: 350}}>Raw Database Response</span></Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    <Divider/><br/>
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
                    <br />
                    {this.state.copied
                      ? <Button onClick={this.copyJSON} size="small" variant="outlined" color="secondary" style={{ fontSize: 11 }}>
                          <i className="fas fa-check"></i>
                          <span style={{ marginLeft: 6 }}>Copied</span>
                        </Button>
                      : <CopyToClipboard text={JSON.stringify(this.state.ipnData, null, ' ')} onCopy={() => this.setState({copied: true})}>
                          <Button onClick={this.copyJSON} size="small" variant="outlined" color="primary" style={{ fontSize: 11 }}>
                            <i className="fas fa-copy"></i>
                            <span style={{ marginLeft: 6 }}>Copy JSON</span>
                          </Button>
                        </CopyToClipboard>
                    }
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
            :<CircularProgress className={classes.progress} size={50} />
          }
        </TabContainer>
      </MuiThemeProvider>
    );
  }
}
TransactionReports.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionReports);
