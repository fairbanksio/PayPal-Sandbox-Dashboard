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

class Help extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <TabContainer>
        <div>
          <h4>Help & FAQ's</h4>
        </div>
      </TabContainer>
    );
  }
}
Help.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Help);