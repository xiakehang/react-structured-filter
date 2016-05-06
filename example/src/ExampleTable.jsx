var React = require('react');
var Griddle = require('griddle-react');
var GriddleWithCallback = require('./GriddleWithCallback');
var StructuredFilter = require('../../src/main');

require('../../src/react-structured-filter.css');

var ExampleData = require('./ExampleData');

var ExampleTable = React.createClass({
  getInitialState: function() {
    return {
      filter: "",
    }
  },


  getJsonData: function(filterString, sortColumn, sortAscending, page, pageSize, callback) {

    if (filterString==undefined) {
      filterString = "";
    }
    if (sortColumn==undefined) {
      sortColumn = "";
    }

    // Normally you would make a Reqwest here to the server
    var results = ExampleData.filter(filterString, sortColumn, sortAscending, page, pageSize);
    callback(results);
  },


  updateFilter: function(filter){
    // Set our filter to json data of the current filter tokens
    this.setState({filter: JSON.stringify(filter)});
  },


  getSymbolOptions: function() {
    return ExampleData.getSymbolOptions();
  },

  getSectorOptions: function() {
    return ExampleData.getSectorOptions();
  },

  getIndustryOptions: function() {
    return ExampleData.getIndustryOptions();
  },


  render: function(){
    return (
      <div>
        <StructuredFilter
          placeholder=""
          options={[
            {category:"Symbol", type:"textoptions", options:this.getSymbolOptions},
            {category:"Name",type:"text"},
            {category:"Price",type:"number"},
            {category:"MarketCap",type:"number"},
            {category:"IPO", type:"date"},
            {category:"Sector", type:"textoptions", options:this.getSectorOptions},
            {category:"Industry", type:"textoptions", options:this.getIndustryOptions}
            ]}
          customClasses={{
            input: "filter-tokenizer-text-input",
            results: "filter-tokenizer-list__container",
            listItem: "filter-tokenizer-list__item"
          }}
          onTokenAdd={this.updateFilter}
          onTokenRemove={this.updateFilter}
          defaultSelected={[
            {
              category: 'Industry',
              operator: '==',
              value: 'Books',
            },
            {
              category: 'IPO',
              operator: '<',
              value: 'Dec 12, 1990 12:00 AM',
            },
          ]}
        />
        <GriddleWithCallback
          getExternalResults={this.getJsonData} filter={this.state.filter}
          resultsPerPage={10}
        />
      </div>
    )
  }
});
module.exports = ExampleTable;
