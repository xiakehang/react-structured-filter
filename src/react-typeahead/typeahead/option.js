import {
  default as React,
  Component,
  PropTypes,
} from 'react';
import classNames from 'classnames';

/**
 * A single option within the TypeaheadSelector
 */
export default class TypeaheadOption extends Component {
  static propTypes = {
    customClasses: PropTypes.object,
    onClick: PropTypes.func,
    children: PropTypes.string,
    hover: PropTypes.bool,
  }

  static defaultProps = {
    customClasses: {},
    onClick( event ) {
      event.preventDefault();
    },
  }

  constructor( ...args ) {
    super( ...args );
    this._onClick = this._onClick.bind( this );
  }

  _getClasses() {
    const classes = {
      'typeahead-option': true,
    };
    classes[ this.props.customClasses.listAnchor ] = !!this.props.customClasses.listAnchor;
    return classNames( classes );
  }

  _onClick() {
    return this.props.onClick();
  }

  render() {
    const classes = {
      hover: this.props.hover,
    };
    classes[ this.props.customClasses.listItem ] = !!this.props.customClasses.listItem;
    const classList = classNames( classes );

    return (
      <li
        className={ classList }
        onClick={ this._onClick }
      >
        <a
          href="#"
          className={ this._getClasses() }
          ref="anchor"
        >
          { this.props.children }
        </a>
      </li>
    );
  }
}
