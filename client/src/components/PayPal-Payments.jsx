import React from "react";
import qs from 'qs';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
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
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  }
});

function getSteps() {
return ['Define API credentials', 'Create payment', 'Approve payment', 'Execute payment', 'Payment complete'];
}

function getStepContent(step) {
  switch (step) {
  case 0:
  return 'Please define your API credentials';
  case 1:
  return 'Please populate the information for payment';
  case 2:
  return 'Approve the payment that was just created';
  case 3:
  return 'Executed the payment';
  case 4:
  return 'Thats it! Payment has been completed succesfully.';
  default:
  return 'Unknown step';
  }
}

class PayPalPayments extends React.Component {


  isStepOptional = step => {
    //return step === 1;
    return step === null;
  };

  handleNext = () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped,
      };
    });
  };

  handleReset = () => {
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    if(apiKey === "" | apiSecret === ""){
      this.setState({activeStep: 0});
      localStorage.setItem("step", 0);
    } else {
      this.setState({activeStep: 1});
      localStorage.setItem("step", 1);
    }

  }

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  constructor(props) {
    super(props);
    this.state = {
      paymentStatus: "",
      activeStep: 0,
      skipped: new Set(),
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
      var url = 'https://'+ serverHost + '/api/create-payment?APIKey=' + apiKey + '&APISecret=' + apiSecret + '&RedirectURL=https://'+ serverHost + '/payments'
      this.setState({paymentStatus:"Creating Payment", activeStep: 1});
      fetch(url)
      .then(response => {
          return response.json()
        }).then(data => {
          console.log(data);
          if(data.response){
            this.setState({paymentStatus:JSON.stringify(data.response)});
          } else {
            this.setState({paymentStatus:"Redirecting for approval",activeStep: 2});
            localStorage.setItem("step", 2);
            window.location = data.links[1].href;
          }
        })
    }
    event.preventDefault();
  }


  componentWillMount(){
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    var activeStep = localStorage.getItem("step")
    if(apiKey === "" | apiSecret === ""){
      this.setState({activeStep: 0});
    } else {
      this.setState({activeStep: 1});
    }

    if(activeStep === 2){
      this.setState({activeStep: 2});
    }
  }

  componentDidMount(){
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    var activeStep = localStorage.getItem("step")
    var urlParams = qs.parse(this.props.location.search.slice(1));
    if (urlParams.paymentId && urlParams.PayerID) {
      this.setState({paymentStatus:"Payment approved... executing payment.",activeStep: 3});
      var url = 'https://'+ serverHost + '/api/execute-payment?paymentId=' + urlParams.paymentId + '&PayerID=' + urlParams.PayerID + '&APIKey=' + apiKey + '&APISecret=' + apiSecret
      fetch(url)
      .then(response => {
          return response.json()
        }).then(data => {
          console.log(data);
          if(data.response){
            this.setState({paymentStatus:JSON.stringify(data.response)});
          } else {
            this.setState({paymentStatus:"Payment executed",activeStep: 5});
          }
        })
    }






  }



  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    return (
      <TabContainer>
        <div>
          <h4>Create Express Checkout Payment</h4>
        </div>



        <div className={classes.root}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const props = {};
              const labelProps = {};
              if (this.isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption">Optional</Typography>;
              }
              if (this.isStepSkipped(index)) {
                props.completed = false;
              }
              return (
                <Step key={label} {...props}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&quot;re finished
                </Typography>
                <Button onClick={this.handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={this.handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  {this.isStepOptional(activeStep) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleSkip}
                      className={classes.button}
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <hr/>
        <div>
          <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleSubmit}>
            Create Payment
          </Button>
        </div>
      </TabContainer>
    );
  }

}

PayPalPayments.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PayPalPayments);
