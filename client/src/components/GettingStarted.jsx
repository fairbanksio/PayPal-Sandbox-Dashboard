import React from 'react';
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import ApiLogin from './ApiLogin.jsx'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  root: {}
});

class GettingStarted extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentWillMount(){
    this.props.tabChange(null, this.props.match.path)
  }

  handleSubmit(){
  }

  handleReset(){
  }

  render() {
    const { classes } = this.props;
    return (
      <TabContainer className={classes.root}>
        <ApiLogin onSubmit={this.handleSubmit} onReset={this.handleReset}/>
      </TabContainer>
    );
  }
}

GettingStarted.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GettingStarted);
