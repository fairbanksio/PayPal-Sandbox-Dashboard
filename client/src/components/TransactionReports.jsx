import React from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

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

class IpnList extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      this.props.ipns.length > 0 ? this.props.ipns.map(function(item,key) {
        return <li key={key}>{item.timestamp + ' - ' + item.status}</li>
      }) : null
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
        <div>
          <h4>Transaction Reports</h4>
          {ipnCount
            ?<div>
              <h6>IPN Count:</h6>
              <pre>{ipnCount}</pre>
            </div>
            :null
          }
          {ipnData.length > 0
            ?<div>
              <h6>IPN Data:</h6>
              <IpnList ipns={this.state.ipnData}/>
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
            :null
          }
        </div>
      </TabContainer>
    );
  }
}
TransactionReports.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionReports);