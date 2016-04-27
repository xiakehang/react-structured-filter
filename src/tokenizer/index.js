import {
  default as React,
  Component,
  PropTypes,
} from 'react';
import ReactDOM from 'react-dom';
import Token from './token';
import KeyEvent from '../keyevent';
import Typeahead from '../typeahead';
import classNames from 'classnames';

function _arraysAreDifferent( array1, array2 ) {
  if ( array1.length !== array2.length ) {
    return true;
  }
  for ( let i = array2.length - 1; i >= 0; i-- ) {
    if ( array2[ i ] !== array1[ i ]) {
      return true;
    }
  }
}

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */
export default class Tokenizer extends Component {

  static propTypes = {
    options: PropTypes.array,
    customClasses: PropTypes.object,
    defaultSelected: PropTypes.array,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onTokenRemove: PropTypes.func,
    onTokenAdd: PropTypes.func,
  }

  static defaultProps = {
    options: [],
    defaultSelected: [],
    customClasses: {},
    defaultValue: '',
    placeholder: '',
    onTokenAdd() {},
    onTokenRemove() {},
  }

  constructor( ...args ) {
    super( ...args );
    this._addTokenForValue = this._addTokenForValue.bind( this );
    this._onKeyDown = this._onKeyDown.bind( this );
    this._getOptionsForTypeahead = this._getOptionsForTypeahead.bind( this );
    this._removeTokenForValue = this._removeTokenForValue.bind( this );
  }

  state = {
    selected: this.props.defaultSelected.slice( 0 ),
    category: '',
    operator: '',
  }

  componentDidMount() {
    this.props.onTokenAdd( this.state.selected );
  }

  componentWillReceiveProps( nextProps ) {
    // if we get new defaultProps, update selected
    if ( _arraysAreDifferent( this.props.defaultSelected, nextProps.defaultSelected )) {
      this.setState({
        selected: nextProps.defaultSelected.slice( 0 ),
      });
    }
  }

  _renderTokens() {
    const tokenClasses = {};
    tokenClasses[ this.props.customClasses.token ] = !!this.props.customClasses.token;
    const classList = classNames( tokenClasses );
    const result = this.state.selected.map( selected => {
      const mykey = selected.category + selected.operator + selected.value;

      return (
        <Token
          key={ mykey }
          className={ classList }
          onRemove={ this._removeTokenForValue }
        >
          { selected }
        </Token>

      );
    }, this );
    return result;
  }

  _getOptionsForTypeahead() {
    let categoryType;

    if ( this.state.category === '' ) {
      const categories = [];
      for ( let i = 0; i < this.props.options.length; i++ ) {
        categories.push( this.props.options[ i ].category );
      }
      return categories;
    } else if ( this.state.operator === '' ) {
      categoryType = this._getCategoryType();

      if ( categoryType === 'text' ) {
        return [ '==', '!=', 'contains', '!contains' ];
      } else if ( categoryType === 'textoptions' ) {
        return [ '==', '!=' ];
      } else if ( categoryType === 'number' || categoryType === 'date' ) {
        return [ '==', '!=', '<', '<=', '>', '>=' ];
      }

      /* eslint-disable no-console */
      console.warn( `WARNING: Unknown category type in tokenizer: "${categoryType}"` );
      /* eslint-enable no-console */

      return [];
    }
    const options = this._getCategoryOptions();
    if ( options === null || options === undefined ) return [];
    return options();
  }

  _getHeader() {
    if ( this.state.category === '' ) {
      return 'Category';
    } else if ( this.state.operator === '' ) {
      return 'Operator';
    }

    return 'Value';
  }

  _getCategoryType() {
    let categoryType;

    for ( let i = 0; i < this.props.options.length; i++ ) {
      if ( this.props.options[ i ].category === this.state.category ) {
        categoryType = this.props.options[ i ].type;
        return categoryType;
      }
    }
  }

  _getCategoryOptions() {
    for ( let i = 0; i < this.props.options.length; i++ ) {
      if ( this.props.options[ i ].category === this.state.category ) {
        return this.props.options[ i ].options;
      }
    }
  }


  _onKeyDown( event ) {
    // We only care about intercepting backspaces
    if ( event.keyCode !== KeyEvent.DOM_VK_BACK_SPACE ) {
      return;
    }

    // Remove token ONLY when bksp pressed at beginning of line
    // without a selection
    const entry = ReactDOM.findDOMNode( this.refs.typeahead.refs.inner.inputRef());
    if ( entry.selectionStart === entry.selectionEnd &&
        entry.selectionStart === 0 ) {
      if ( this.state.operator !== '' ) {
        this.setState({ operator: '' });
      } else if ( this.state.category !== '' ) {
        this.setState({ category: '' });
      } else {
        // No tokens
        if ( !this.state.selected.length ) {
          return;
        }
        this._removeTokenForValue(
          this.state.selected[ this.state.selected.length - 1 ]
        );
      }
      event.preventDefault();
    }
  }

  _removeTokenForValue( value ) {
    const index = this.state.selected.indexOf( value );
    if ( index === -1 ) {
      return;
    }

    this.state.selected.splice( index, 1 );
    this.setState({ selected: this.state.selected });
    this.props.onTokenRemove( this.state.selected );

    return;
  }

  _addTokenForValue( value ) {
    if ( this.state.category === '' ) {
      this.setState({ category: value });
      this.refs.typeahead.refs.inner.setEntryText( '' );
      return;
    }

    if ( this.state.operator === '' ) {
      this.setState({ operator: value });
      this.refs.typeahead.refs.inner.setEntryText( '' );
      return;
    }

    const newValue = {
      category: this.state.category,
      operator: this.state.operator,
      value,
    };

    this.state.selected.push( newValue );
    this.setState({ selected: this.state.selected });
    this.refs.typeahead.refs.inner.setEntryText( '' );
    this.props.onTokenAdd( this.state.selected );

    this.setState({
      category: '',
      operator: '',
    });

    return;
  }

  /*
   * Returns the data type the input should use ("date" or "text")
   */
  _getInputType() {
    if ( this.state.category !== '' && this.state.operator !== '' ) {
      return this._getCategoryType();
    }

    return 'text';
  }

  render() {
    const classes = {};
    classes[ this.props.customClasses.typeahead ] = !!this.props.customClasses.typeahead;
    const classList = classNames( classes );
    return (
      <div className="filter-tokenizer">
        <div className="token-collection">
          { this._renderTokens() }

          <div className="filter-input-group">
            <div className="filter-category">{ this.state.category } </div>
            <div className="filter-operator">{ this.state.operator } </div>

            <Typeahead ref="typeahead"
              className={ classList }
              placeholder={ this.props.placeholder }
              customClasses={ this.props.customClasses }
              options={ this._getOptionsForTypeahead() }
              header={ this._getHeader() }
              datatype={ this._getInputType() }
              defaultValue={ this.props.defaultValue }
              onOptionSelected={ this._addTokenForValue }
              onKeyDown={ this._onKeyDown }
            />
            </div>
          </div>
      </div>
    );
  }
}
