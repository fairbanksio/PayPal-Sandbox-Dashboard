import React from "react";
import qs from 'qs';
import Typography from '@material-ui/core/Typography';


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class PayPalPayments extends React.Component {

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
    var apiKey = localStorage.getItem('apiKey')
    var apiSecret = localStorage.getItem('apiSecret')
    var url = 'https://paygen.bsord.io/api/create-payment?APIKey=' + apiKey + '&APISecret=' + apiSecret + "&RedirectURL=https://paygen.bsord.io/payments"
    this.setState({paymentStatus:"Creating Payment"});
    fetch(url)
    .then(response => {
        return response.json()
      }).then(data => {
        console.log(data);
        if(data.response){
          this.setState({paymentStatus:JSON.stringify(data.response)});
        } else {
          this.setState({paymentStatus:"Redirecting for approval"});
          window.location = data.links[1].href;

        }
      })

    event.preventDefault();
  }

  componentDidMount(){
    var urlParams = qs.parse(this.props.location.search.slice(1));
    if (urlParams.paymentId && urlParams.PayerID) {
      this.setState({paymentStatus:"Payment approved... executing payment."});
      var url = 'https://paygen.bsord.io/api/execute-payment?paymentId=' + urlParams.paymentId + '&PayerID=' + urlParams.PayerID
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
    return (

      <TabContainer>
        <div>
          <h4>Create Express Checkout Payment</h4>
          <form onSubmit={this.handleSubmit}>
            <label>
              API Key:
              <input id= "apiKey" type="text" value={localStorage.getItem('apiKey')} onChange={this.handleChange} />
              API Secret:
              <input id= "apiSecret" type="text" value={localStorage.getItem('apiSecret')} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Create Payment" />
            {this.state.paymentStatus}
          </form>
        </div>



      </TabContainer>



    );
  }

}

export default PayPalPayments
