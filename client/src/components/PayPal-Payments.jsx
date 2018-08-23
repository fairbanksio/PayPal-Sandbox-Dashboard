import React from "react";
import qs from 'qs';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


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
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  }
});

function getSteps() {
return ['Define API credentials', 'Create payment', 'Approve payment', 'Execute payment', 'Payment complete'];
}

class StepContent extends React.Component{

  handleChange(event) {
    // Save to Local Storage
    localStorage.setItem(event.target.id, event.target.value);
  }

  render(){
    const { classes } = this.props;
    var { step } = this.props

    switch (step) {
      case 0:
        return 'Please define your API credentials';
      case 1:
        return (
          <div>
            Please define payment details <br/>
            <TextField
              id="pItemName"
              label="Item Name"
              type="search"
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange}
              style={{width: '500px'}}
            />
            <br/>
            <TextField
              id="pItemCost"
              label="Item Price"
              type="search"
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange}
              style={{width: '500px'}}
            />
          </div>
        );
      case 2:
      return 'Approve the payment that was just created';
      case 3:
      return 'Execute the payment';
      case 4:
      return 'Thats it! Payment has been completed succesfully.';
      default:
      return 'Unknown step';
    }
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

    switch(activeStep){
      case 0:
        this.setState({
          activeStep: activeStep + 1,
          skipped,
        });
        break;

      case 1:
        this.createPayment();
        console.log('create payment');
        break;

      case 2:
        this.approvePayment();
        console.log('approve payment');
        break;

      case 3:
        this.executePayment();
        console.log('execute payment');

        break;
      case 4:
        console.log('finish payment');
        this.setState({
          activeStep: activeStep + 1,
          skipped,
        });
        break;

      default:
        break;
    }


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
    this.createPayment = this.createPayment.bind(this);
  }

  handleChange(event) {
    // Save to Local Storage
    localStorage.setItem(event.target.id, event.target.value);
  }

  getStepButtonText(step){
    switch (step) {
      case 0:
        return 'Save Credentials';
      case 1:
        return 'Create Payment'
      case 2:
      return 'Approve Payment';
      case 3:
      return 'Execute Payment';
      case 4:
      return 'Finish Payment';
      default:
      return 'Unknown';
    }
  }

  createPayment() {
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    if (apiKey === "" && apiSecret === ""){
      //this.setState({paymentStatus:"API Credentials not defined"});
    } else {
      var url = 'https://'+ serverHost + '/api/create-payment?APIKey=' + apiKey + '&APISecret=' + apiSecret + '&RedirectURL=https://'+ serverHost + '/payments'
      fetch(url)
      .then(response => {
          return response.json()
        }).then(data => {
          console.log(data);
          if(data.response){
            this.setState({pData:JSON.stringify(data, null, ' ')});
          } else {
            //this.setState({paymentStatus:"Redirecting for approval",activeStep: 2});
            //this.setState({paymentStatus:JSON.stringify(data.response)});
            this.setState({pData:JSON.stringify(data, null, ' ')});
            this.setState({activeStep: 2});
            localStorage.setItem("step", 2);
            localStorage.setItem("pRedirect", data.links[1].href);
            //window.location = data.links[1].href;
          }
        })
    }
    //event.preventDefault();
  }

  approvePayment() {
    localStorage.setItem("pData",this.state.pData);
    localStorage.setItem("step",3);
    window.location = localStorage.getItem("pRedirect");

  }

  componentWillMount(){

  }

  executePayment(){
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    var paymentId = localStorage.getItem("paymentId")
    var payerId = localStorage.getItem("payerId")

    var url = 'https://'+ serverHost + '/api/execute-payment?paymentId=' + paymentId + '&PayerID=' + payerId + '&APIKey=' + apiKey + '&APISecret=' + apiSecret
    fetch(url)
    .then(response => {
        return response.json()
      }).then(data => {
        console.log(data);
        if(data.response){
          this.setState({pData:JSON.stringify(data, null, ' ')});
        } else {
          this.setState({activeStep: 4});
          this.setState({pData:JSON.stringify(data, null, ' ')});
        }
      })

  }

  componentDidMount(){
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    var urlParams = qs.parse(this.props.location.search.slice(1));

    if(apiKey === "" | apiSecret === ""){
      this.setState({activeStep: 0});
    } else {
      this.setState({activeStep: 1});
    }

    if (urlParams.paymentId && urlParams.PayerID) {
      localStorage.setItem("paymentId", urlParams.paymentId);
      localStorage.setItem("payerId", urlParams.PayerID);
      this.setState({activeStep: 3});
      this.setState({pData:localStorage.getItem("pData")})
    }





  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    const { pData } = this.state;
    return (
      <TabContainer>
        <div>
          <h3>Create Express Checkout Payment</h3>
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
                <Button variant="outlined" onClick={this.handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}><StepContent {...this.props} step={activeStep} /></Typography>
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
                      variant="outlined"
                      color="primary"
                      onClick={this.handleSkip}
                      className={classes.button}
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                  >
                    {this.getStepButtonText(activeStep)}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <hr/>
        <Typography component="div" style={{ padding: 8 * 3 }}>
          <pre>
            {pData}
          </pre>
        </Typography>
      </TabContainer>
    );
  }
}

PayPalPayments.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PayPalPayments);
