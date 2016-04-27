`index` (component)
===================

A typeahead that, when an option is selected, instead of simply filling
the text entry widget, prepends a renderable "token", that may be deleted
by pressing backspace on the beginning of the line with the keyboard.

Example usage:

     import StructuredFilter from 'react-structured-filter';

     <StructuredFilter
       placeholder="Search..."
       options={[
         {category:"Name",type:"text"},
         {category:"Price",type:"number"},
       ]}
     />

Props
-----

### `customClasses`

type: `object`  
defaultValue: `{}`  


### `defaultSelected`

type: `array`  
defaultValue: `[]`  


### `defaultValue`

type: `string`  
defaultValue: `''`  


### `onTokenAdd`

type: `func`  
defaultValue: `function() {}`  


### `onTokenRemove`

type: `func`  
defaultValue: `function() {}`  


### `options`

An array of structures with the components `category` and `type`

* _category_: Name of the first thing the user types.
* _type_: This can be one of the following:
  * _text_: Arbitrary text for the value. No autocomplete options.
    Operator choices will be: `==`, `!=`, `contains`, `!contains`.
  * _textoptions_: You must additionally pass an options value which
    will be a function that returns the list of options choices as an
    array (for example `function getOptions() {return ["MSFT", "AAPL",
    "GOOG"]}`). Operator choices will be: `==`, `!=`.
  * _number_: Arbitrary text for the value. No autocomplete options.
    Operator choices will be: `==`, `!=`, `<`, `<=`, `>`, `>=`.
  * _date_: Shows a calendar and the input must be of the form
    `YYYY-MM-DD`. Operator choices will be: `==`, `!=`, `<`, `<=`, `>`,
    `>=`.

Example:

    [
      {
        "category": "Symbol",
        "type": "textoptions",
        "options": function() {return ["MSFT", "AAPL", "GOOG"]}
      },
      {
        "category": "Name",
        "type": "text"
      },
      {
        "category": "Price",
        "type": "number"
      },
      {
        "category": "MarketCap",
        "type": "number"
      },
      {
        "category": "IPO",
        "type": "date"
      }
    ]

type: `array`  
defaultValue: `[]`  


### `placeholder`

type: `string`  
defaultValue: `''`  

