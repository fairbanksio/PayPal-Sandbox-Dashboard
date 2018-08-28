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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    backgroundColor: '#FFFFFF' || theme.palette.background.paper,
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
  group: {
    margin: `${theme.spacing.unit}px 0`,
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexShrink: 0,
    paddingRight: theme.spacing.unit * 3,

  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    paddingRight: theme.spacing.unit * 3,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  progress: {
    marginLeft: theme.spacing.unit * 1.5,
    marginRight: theme.spacing.unit
  }
});

function getSteps() {
  return ['Create payment', 'Approve payment', 'Execute payment'];
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
      case 1:
      return 'Approve the payment that was just created';
      case 2:
      return 'Execute the payment';
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
        this.createPayment();
        console.log('create payment');
        break;

      case 1:
        this.approvePayment();
        console.log('approve payment');
        break;

      case 2:
        this.executePayment();
        console.log('execute payment');

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
    this.setState({activeStep: 0, pData: null});
    localStorage.setItem("step", 0);
    localStorage.setItem("pData", null);
    this.setState({chipStatus:''})
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
      mode: 'quick',
      chipStatus: '',
      chipIndicator: '',
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
        return 'Create Payment'
      case 1:
      return 'Approve Payment';
      case 2:
      return 'Execute Payment';
      default:
      return 'Unknown';
    }
  }

  createPayment() {
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    var itemName = localStorage.getItem("pItemName")
    var itemCost = localStorage.getItem("pItemCost")
    this.setState({chipStatus:'Creating payment...', chipIndicator:'loading'})
    console.log(itemName);
    console.log(itemCost);
    var redirectURL = 'https://'+ serverHost + '/payments'
    var create_payment_json = {
			"intent": "sale",
			"payer": {
					"payment_method": "paypal"
			},
			"redirect_urls": {
					"return_url": redirectURL,
					"cancel_url": redirectURL
			},
			"transactions": [{
					"item_list": {
							"items": [{
									"name": itemName || "Default Item",
									"sku": "item",
									"price": itemCost || "2.00",
									"currency": "USD",
									"quantity": 1
							}]
					},
					"amount": {
							"currency": "USD",
							"total": itemCost || "2.00"
					},
					"description": "This is the payment description."
			}]
		};
    var data = {payment:create_payment_json, apiCredentials: {key:apiKey, secret:apiSecret}, redirectUrl: redirectURL}
    var url = 'https://'+ serverHost + '/api/create-payment'

    fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => {
        if (!response.ok) { throw response }
        return response.json()  //we only get here if there is no error
      }).then(data => {
        if(data.response){
          var sdkError = 'PayPal SDK Failure: ' + data.response.details[0].issue + '. (' + data.response.debug_id + ')'
          this.setState({chipStatus:sdkError, chipIndicator:'error'})
        } else {
          //this.setState({paymentStatus:"Redirecting for approval",activeStep: 2});
          //this.setState({paymentStatus:JSON.stringify(data.response)});
          this.setState({
            chipStatus:'Billing plan created successfully!',
            chipIndicator:'success',
            pData:data,
            activeStep: 1
          });

          localStorage.setItem("step", 1);
          localStorage.setItem("pRedirect", data.links[1].href);

          if(localStorage.getItem("mode") === 'quick'){
            if(localStorage.getItem("step") === '1'){
              this.approvePayment();
            }
          }
          //window.location = data.links[1].href;
        }
      }).catch( err => {
            this.setState({chipStatus:'Error making request to API ('+url+'): ' + err.status + ' - ' + err.statusText, chipIndicator:'error'})
        })
  }

  approvePayment() {
    localStorage.setItem("pData",JSON.stringify(this.state.pData));
    localStorage.setItem("step",2);
    this.setState({chipStatus:'Redirecting to PayPal for approval...', chipIndicator:'loading'})
    window.location = localStorage.getItem("pRedirect");
  }

  componentWillMount(){
    var urlParams = qs.parse(this.props.location.search.slice(1));
    this.setState({activeStep: 0, mode: localStorage.getItem("mode")});
    if (urlParams.paymentId && urlParams.PayerID) {
      localStorage.setItem("paymentId", urlParams.paymentId);
      localStorage.setItem("payerId", urlParams.PayerID);
      this.setState({activeStep: 2});
      this.setState({pData:JSON.parse(localStorage.getItem("pData"))})
      this.setState({chipStatus:'Billing agreement approved', chipIndicator:'success'})
      if(localStorage.getItem("mode") === 'quick'){
        this.executePayment();
      }
    }

  }

  executePayment(){
    var apiKey = localStorage.getItem("clientID")
    var apiSecret = localStorage.getItem("clientSecret")
    var paymentId = localStorage.getItem("paymentId")
    var payerId = localStorage.getItem("payerId")
    console.log(payerId);
    console.log(paymentId);
    var url = 'https://'+ serverHost + '/api/execute-payment'
    var data = {apiCredentials: {key:apiKey, secret:apiSecret}, paymentId: paymentId, PayerID:payerId}
    this.setState({chipStatus:'Executing payment...', chipIndicator:'loading'})
    fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => {
        if (!response.ok) { throw response }
        return response.json()
      }).then(data => {
        if(data.response){
          var sdkError = 'PayPal SDK Failure: ' + data.response.details[0].issue + '. (' + data.response.debug_id + ')'
          this.setState({chipStatus:sdkError, chipIndicator:'error'})
        } else {
          this.setState({activeStep: 3});
          this.setState({pData:data});
          this.setState({chipStatus:'Billing agreement has been executed successfully!', chipIndicator:'success'})
        }
      }).catch( err => {
            this.setState({chipStatus:'Error making request to API ('+url+'): ' + err.status + ' - ' + err.statusText, chipIndicator:'error'})
        })
  }

  handleModeChange = event => {
    this.setState({ mode: event.target.value });
    localStorage.setItem("mode", event.target.value)
  };

  getChipIcon(chipIndicator){
    const { classes } = this.props;
    switch (chipIndicator) {
      case 'loading':
        return (
          <CircularProgress className={classes.progress} size={15} />
        );
      case 'success':
        return (
          <i className="far fa-check-circle" style={{color: '#090',padding: '8px 12px'}}/>
        );
      case 'error':
        return (
          <i className="far fa-times-circle" style={{color: '#900',padding: '8px 12px'}}/>
        );
      default:
        return 'Unknown';
    }
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps(this.state.mode);
    const { activeStep } = this.state;
    var pData = this.state.pData;
    var pDataStringified = JSON.stringify(pData, null, ' ');
    const { expanded } = this.state;
    var {chipStatus} = this.state;
    var {chipIndicator} = this.state;
    return (
      <TabContainer>
        <div>
          <h4>Create Express Checkout Payment</h4>
        </div>
        <React.Fragment>
          <CssBaseline />
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <div className={classes.root}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Payment Mode:</FormLabel>
                  <RadioGroup
                    aria-label="Mode"
                    name="mode"
                    className={classes.group}
                    value={this.state.mode}
                    onChange={this.handleModeChange}
                  >
                    <FormControlLabel value="quick" control={<Radio />} label="Quick" />
                    <FormControlLabel value="custom" control={<Radio />} label="Custom" />
                  </RadioGroup>
                  <FormHelperText>Quick payments will be processed automatically, Custom payments require user action for each step.</FormHelperText>
                </FormControl>
              </div>
            </Paper>

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
                <div className={classes.root}>
                  {activeStep === steps.length ? (
                    <div>
                      <Typography className={classes.instructions}>
                        Payment completed succesfully.
                      </Typography>
                      <Button variant="outlined" onClick={this.handleReset} className={classes.button}>
                        Start Over
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Typography className={classes.instructions}>
                        {this.state.mode === 'custom' ? (
                          <StepContent {...this.props} step={activeStep} />
                          ):(null)
                        }
                      </Typography>
                      <div>
                        {activeStep !== 0 ? (
                          <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.button}
                          >
                            Back
                          </Button>
                        ):(null)}

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

                {chipStatus !== '' ? (
                  <Chip
                    avatar={
                      this.getChipIcon(chipIndicator)
                    }
                    label={chipStatus}
                    className={classes.chip}
                  />
                ):(null)}

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
                  <Typography className={classes.heading}>
                    <span style={{fontWeight: 375}}><b>Status: </b>{pData.state}</span>
                  </Typography>
                  <Typography className={classes.secondaryHeading}>
                    <span style={{fontWeight: 350}}>{moment(pData.create_time).format('ddd, MMM Do YYYY @ h:mm:ss A')}</span>
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                      <Typography variant="caption">
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
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ):(
              null
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
