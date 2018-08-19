import React from "react";
import qs from 'qs';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

var serverHost = process.env.REACT_APP_HOST;

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

class BillingAgreements extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      paymentStatus: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


  }

  handleChange(event) {
    //save to local storage
    localStorage.setItem(event.target.id, event.target.value);
  }

  handleSubmit(event) {
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    if (apiKey === "" && apiSecret === ""){
      this.setState({paymentStatus:"API Credentials not defined"});
    } else {
      var url = 'https://'+ serverHost + '/api/create-agreement?APIKey=' + apiKey + '&APISecret=' + apiSecret + '&RedirectURL=https://'+ serverHost + '/agreements'
      this.setState({paymentStatus:"Creating Agreement"});
      fetch(url)
      .then(response => {
          return response.json()
        }).then(data => {
          console.log(data);
          if(data.response){
            this.setState({paymentStatus:JSON.stringify(data.response)});
          } else {
            this.setState({paymentStatus:"Redirecting for approval"});
            console.log(data);
            window.location = data.links[0].href;

          }
        })
    }

    event.preventDefault();
  }

  componentDidMount(){
    var urlParams = qs.parse(this.props.location.search.slice(1));
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    if (urlParams.token) {
      this.setState({paymentStatus:"Payment approved... executing agreement."});
      var url = 'https://'+ serverHost + '/api/execute-agreement?token=' + urlParams.token + '&APIKey=' + apiKey + '&APISecret=' + apiSecret
      fetch(url)
      .then(response => {
          return response.json()
        }).then(data => {
          console.log(data);
          if(data.response){
            this.setState({paymentStatus:JSON.stringify(data.response)});
          } else {
            this.setState({paymentStatus:"Payment Executed"});
          }
        })
    }

  }



  render() {
    const { classes } = this.props;
    return (

      <TabContainer>

        <div>
          <h4>Create a Billing Agreement</h4>
          <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleSubmit}>
            Create Agreement
          </Button>
          <hr/>
          {this.state.paymentStatus}
        </div>



      </TabContainer>



    );
  }


}
BillingAgreements.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BillingAgreements);
