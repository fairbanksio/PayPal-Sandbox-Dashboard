import React from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
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
    console.log(classes);
    return (
      this.props.ipns.length > 0 ? this.props.ipns.map(function(item, key) {
        var ipnData = JSON.stringify(item.ipnMessage, null, ' ');
        return (
          <ExpansionPanel key={key} expanded={expanded === 'panel' + key} onChange={this.handleChange('panel' + key)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{moment(item.timestamp).format('dddd, MMMM Do YYYY, hh:mm:ss a')}</Typography>
              <Typography>{item.status}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <pre
                  style={{
                    whiteSpace: 'pre',
                    height: '200px',
                    overflowX: 'auto',
                    backgroundColor: '#f5f5f5',
                    padding: '7px',
                  }}
                >
                  {ipnData}
                </pre>
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
      ipnCount: null
    };
    this.getIpnData = this.getIpnData.bind(this);
    this.getIpnCount = this.getIpnCount.bind(this);
  }

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

  componentDidMount() {
    this.getIpnData();
    this.getIpnCount();
  }

  render() {
    const { classes } = this.props;
    var ipnData = this.state.ipnData;
    var ipnCount = this.state.ipnCount;
    return (
      <TabContainer>
        <h4>Transaction Reports</h4>
        {ipnData.length > 0
          ?<div>
            <IpnList ipns={this.state.ipnData}/>
            <span>{'Total Transactions: ' + ipnCount}</span>
            <hr/>
            <h6>DB Collection:</h6>
            <pre
              style={{
                whiteSpace: 'pre',
                height: '200px',
                overflowX: 'auto',
                backgroundColor: '#f5f5f5',
                padding: '7px'
              }}
            >
              {JSON.stringify(ipnData, null, ' ')}
            </pre>
          </div>
          :<p>Transaction data is loading...</p>
        }
      </TabContainer>
    );
  }
}
TransactionReports.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionReports);