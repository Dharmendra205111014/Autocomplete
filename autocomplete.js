var autocomplete = function (obj) {
  this.dataStore = obj.dataArray || [];
  this.inputBox = document.getElementById(obj.inputBox);
  this.async = obj.Async || false;
  this.dataInputBox = obj.doc || {};
  this.suggestionBox = undefined;
  this.minSuggestionChar = obj.minSuggestionChar || 3;
  this.metaData = {};
}

autocomplete.prototype.createTemplate = function() {
  var i = document.createElement('input');
  i.setAttribute('class', 'autocompleteInput');
  i.id = this.inputBox.id + 'InputBox';
  var d = document.createElement('div');
  d.setAttribute('class', 'autocompleteSelectBox');
  d.id = this.inputBox.id + 'SuggestionBox';

  this.inputBox.appendChild(i);
  this.inputBox.appendChild(d);
  this.dataInputBox = i;
  this.suggestionBox = d;

};

autocomplete.prototype.display = function() {
  this.createTemplate();
  var self = this;
  document.getElementById(this.inputBox.id+'InputBox').addEventListener('keyup', function() {
    if (event.which === 40) {
      self.heilightSuggestionDown();
    } else if (event.which === 38) {
      self.heilightSuggestionUp();
    } else {
      var val = this.value;
      self.getInputText.call(self, val);
    }
  });
};

autocomplete.prototype.getInputText = function(val) {
  this.suggestionBox.innerHTML = ""
  if(!this.metaData[val] && this.minSuggestionChar <= val.length) {
    this.createMetaData(val);
  }
  this.buildSuggestionBox(val);
};

autocomplete.prototype.buildSuggestionBox = function(val) {
  var suggestions = this.metaData[val];
  var result;
  if(suggestions && suggestions.length > 0) {
    result = "<ul>";
    for (var i=0; i<suggestions.length; i++) {
      result += '<li>'+ suggestions[i] +'</li>'
    }
    result+='</ul>';
    this.suggestionBox.innerHTML = result;
  }
}

autocomplete.prototype.createMetaData = function(val) {
  var resultArr = [];
  for (var i=0; i<this.dataStore.length; i++) {
    var str = this.dataStore[i].toLowerCase();
    if (str.indexOf(val.toLowerCase()) !== -1) {
      resultArr.push(this.dataStore[i]);
    }
  }
  this.metaData[val] = resultArr;
};
