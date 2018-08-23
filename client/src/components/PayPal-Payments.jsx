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
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import moment from 'moment';
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
  },
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit,
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
      this.setState({activeStep: 1, pData: null});
      localStorage.setItem("step", 1);
      localStorage.setItem("pData", null);
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
      expanded: "panel1",
    };
    this.handleChange = this.handleChange.bind(this);
    this.createPayment = this.createPayment.bind(this);
  }

  handleChange(event) {
    // Save to Local Storage
    localStorage.setItem(event.target.id, event.target.value);
  }

  handlePanel = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

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
          if(data.response){
            this.setState({pData:data});
          } else {
            //this.setState({paymentStatus:"Redirecting for approval",activeStep: 2});
            //this.setState({paymentStatus:JSON.stringify(data.response)});
            this.setState({pData:data});
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
    localStorage.setItem("pData",JSON.stringify(this.state.pData));
    localStorage.setItem("step",3);
    window.location = localStorage.getItem("pRedirect");

  }

  componentWillMount(){
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
      this.setState({pData:JSON.parse(localStorage.getItem("pData"))})
    }
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
        if(data.response){
          this.setState({pData:data});
        } else {
          this.setState({activeStep: 4});
          this.setState({pData:data});
        }
      })

  }



  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    var pData = this.state.pData;
    var pDataStringified = JSON.stringify(pData, null, ' ');
    const { expanded } = this.state;

    return (
      <TabContainer>
        <div>
          <h3>Create Express Checkout Payment</h3>
        </div>
        <React.Fragment>
          <CssBaseline />
          <main className={classes.layout}>
            <Paper className={classes.paper}>
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
            </Paper>

            {pData ? (
              <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handlePanel('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    <i className="far fa-check-circle" style={{
                          color: '#090',
                          paddingRight: '25px'
                        }}/>
                    <span style={{fontWeight: 375}}><b>Payment ID: </b>{pData.id}</span>
                  </Typography>
                  <Typography className={classes.secondaryHeading}>
                    <span style={{fontWeight: 350}}>{moment(pData.create_time).format('ddd, MMM Do YYYY @ h:mm:ss A')}</span>
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    <div style={{ width: 'auto'}}>
                      <Typography variant="caption">
                        <span style={{ paddingRight: '25px' }}><b>Payment Status: </b>{pData.state}</span>
                        <span style={{ paddingRight: '25px' }}><b>Payment Intent: </b>{pData.intent}</span>
                        <span style={{ paddingRight: '25px' }}><b>Payment Method: </b>{pData.payer.payment_method}</span>
                        <span style={{ paddingRight: '25px' }}><b>Payment Amount: </b>{pData.transactions[0].amount.total}</span>
                      </Typography>
                      <hr/>
                      <div>
                        <h4>Payment Details</h4>
                        <CodeMirror
                          ref='ipnMessage'
                          value={pDataStringified}
                          options={{
                            lineNumbers: true,
                            mode: { name: 'javascript', json: true },
                            theme: 'material',
                            readOnly: 'nocursor' // Nocursor for proper mobile handling
                          }}
                          onChange={(editor, pDataStringified, value) => {}}
                          preserveScrollPosition={true}
                        />
                      </div>
                    </div>
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ):(
              <Typography className={classes.heading}>
                <span style={{ paddingRight: '25px' }}><b> No Payment Created Yet</b></span>
              </Typography>
            )}

          </main>
        </React.Fragment>
      </TabContainer>
    );
  }
}

PayPalPayments.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PayPalPayments);
