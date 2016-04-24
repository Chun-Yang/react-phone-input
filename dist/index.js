'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _collection = require('lodash/collection');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _countryData = require('./country-data.js');

var _countryData2 = _interopRequireDefault(_countryData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var allCountries = _countryData2.default.allCountries;

var isModernBrowser = Boolean(document.createElement('input').setSelectionRange);

var keys = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37,
  ENTER: 13,
  ESC: 27,
  PLUS: 43,
  A: 65,
  Z: 90,
  SPACE: 32
};

function isNumberValid(inputNumber) {
  var countries = _countryData2.default.allCountries;
  return _lodash2.default.some(countries, function (country) {
    return _lodash2.default.startsWith(inputNumber, country.dialCode) || _lodash2.default.startsWith(country.dialCode, inputNumber);
  });
}

function getOnlyCountries(onlyCountriesArray) {
  if (onlyCountriesArray.length === 0) {
    return allCountries;
  } else {
    var _ret = function () {
      var selectedCountries = [];
      allCountries.map(function (country) {
        onlyCountriesArray.map(function (selCountry) {
          if (country.iso2 === selCountry) {
            selectedCountries.push(country);
          }
        });
      });
      return {
        v: selectedCountries
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
}

function excludeCountries(selectedCountries, excludedCountries) {
  if (excludedCountries.length === 0) {
    return selectedCountries;
  } else {
    var newSelectedCountries = (0, _collection.filter)(selectedCountries, function (selCountry) {
      return !(0, _collection.includes)(excludedCountries, selCountry.iso2);
    });
    return newSelectedCountries;
  }
}

var ReactPhoneInput = function (_React$Component) {
  _inherits(ReactPhoneInput, _React$Component);

  function ReactPhoneInput(props) {
    _classCallCheck(this, ReactPhoneInput);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReactPhoneInput).call(this, props));

    var inputNumber = _this.props.value || '';
    var onlyCountries = excludeCountries(getOnlyCountries(props.onlyCountries), props.excludeCountries);
    var selectedCountryGuess = _this.guessSelectedCountry(inputNumber.replace(/\D/g, ''), onlyCountries);
    var selectedCountryGuessIndex = _lodash2.default.findIndex(allCountries, selectedCountryGuess);
    var dialCode = selectedCountryGuess && !_lodash2.default.startsWith(inputNumber, selectedCountryGuess.dialCode) ? selectedCountryGuess.dialCode : '';
    var formattedNumber = _this.formatNumber(dialCode + inputNumber.replace(/\D/g, ''), selectedCountryGuess ? selectedCountryGuess.format : null);
    var preferredCountries = _this.props.preferredCountries.map(function (preferredCountry) {
      return (0, _collection.find)(allCountries, { ios2: preferredCountry });
    }).filter(Boolean);

    _this.getNumber = _this.getNumber.bind(_this);
    _this.getValue = _this.getValue.bind(_this);
    _this.scrollTo = _this.scrollTo.bind(_this);
    _this.formatNumber = _this.formatNumber.bind(_this);
    _this._cursorToEnd = _this._cursorToEnd.bind(_this);
    _this.guessSelectedCountry = _this.guessSelectedCountry.bind(_this);
    _this.getElement = _this.getElement.bind(_this);
    _this.handleInput = _this.handleInput.bind(_this);
    _this.handleInputClick = _this.handleInputClick.bind(_this);
    _this.handleFlagItemClick = _this.handleFlagItemClick.bind(_this);
    _this.handleInputFocus = _this.handleInputFocus.bind(_this);
    _this._getHighlightCountryIndex = _this._getHighlightCountryIndex.bind(_this);
    _this._searchCountry = _this._searchCountry.bind(_this);
    _this.searchCountry = _this.searchCountry.bind(_this);
    _this.handleKeydown = _this.handleKeydown.bind(_this);
    _this.handleInputKeyDown = _this.handleInputKeyDown.bind(_this);
    _this.getCountryDropDownList = _this.getCountryDropDownList.bind(_this);

    _this.state = {
      preferredCountries: preferredCountries,
      selectedCountry: selectedCountryGuess,
      highlightCountryIndex: selectedCountryGuessIndex,
      formattedNumber: formattedNumber,
      showDropDown: false,
      queryString: '',
      freezeSelection: false,
      debouncedQueryStingSearcher: _lodash2.default.debounce(_this.searchCountry, 100),
      onlyCountries: onlyCountries
    };
    return _this;
  }

  _createClass(ReactPhoneInput, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }, {
    key: 'getNumber',
    value: function getNumber() {
      return this.state.formattedNumber !== '+' ? this.state.formattedNumber : '';
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.getNumber();
    }
  }, {
    key: 'isSingleCountry',
    value: function isSingleCountry() {
      return _lodash2.default.size(this.state.onlyCountries) === 1;
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo(country, middle) {
      if (!country) return;

      var container = _reactDom2.default.findDOMNode(this.refs.flagDropdownList);

      if (!container) return;

      var containerHeight = container.offsetHeight;
      var containerOffset = container.getBoundingClientRect();
      var containerTop = containerOffset.top + document.body.scrollTop;
      var containerBottom = containerTop + containerHeight;

      var element = country;
      var elementOffset = element.getBoundingClientRect();

      var elementHeight = element.offsetHeight;
      var elementTop = elementOffset.top + document.body.scrollTop;
      var elementBottom = elementTop + elementHeight;
      var newScrollTop = elementTop - containerTop + container.scrollTop;
      var middleOffset = containerHeight / 2 - elementHeight / 2;

      if (elementTop < containerTop) {
        // scroll up
        if (middle) {
          newScrollTop -= middleOffset;
        }
        container.scrollTop = newScrollTop;
      } else if (elementBottom > containerBottom) {
        // scroll down
        if (middle) {
          newScrollTop += middleOffset;
        }
        var heightDifference = containerHeight - elementHeight;
        container.scrollTop = newScrollTop - heightDifference;
      }
    }
  }, {
    key: 'formatNumber',
    value: function formatNumber(text, pattern) {
      if (!text || text.length === 0) {
        return '+';
      }

      // for all strings with length less than 3, just return it (1, 2 etc.)
      // also return the same text if the selected country has no fixed format
      if (text && text.length < 2 || !pattern || !this.props.autoFormat) {
        return '+' + text;
      }

      var formattedObject = (0, _collection.reduce)(pattern, function (acc, character) {
        if (acc.remainingText.length === 0) {
          return acc;
        }

        if (character !== '.') {
          return {
            formattedText: acc.formattedText + character,
            remainingText: acc.remainingText
          };
        }

        return {
          formattedText: acc.formattedText + _lodash2.default.first(acc.remainingText),
          remainingText: _lodash2.default.tail(acc.remainingText)
        };
      }, { formattedText: '', remainingText: text.split('') });
      return formattedObject.formattedText + formattedObject.remainingText.join('');
    }

    // put the cursor to the end of the input (usually after a focus event)

  }, {
    key: '_cursorToEnd',
    value: function _cursorToEnd() {
      var input = _reactDom2.default.findDOMNode(this.refs.numberInput);
      input.focus();
      if (isModernBrowser) {
        var len = input.value.length;
        input.setSelectionRange(len, len);
      }
    }
  }, {
    key: 'getElement',
    value: function getElement(index) {
      return _reactDom2.default.findDOMNode(this.refs['flag_no_' + index]);
    }
  }, {
    key: 'handleFlagDropdownClick',
    value: function handleFlagDropdownClick() {
      var _this2 = this;

      if (this.isSingleCountry()) {
        return;
      }

      // need to put the highlight on the current selected country if the dropdown is going to open up
      this.setState({
        showDropDown: !this.state.showDropDown,
        highlightCountry: (0, _collection.find)(this.state.onlyCountries, this.state.selectedCountry),
        highlightCountryIndex: _lodash2.default.findIndex(this.state.onlyCountries, this.state.selectedCountry)
      }, function () {
        if (_this2.state.showDropDown) {
          _this2.scrollTo(_this2.getElement(_this2.state.highlightCountryIndex + _this2.state.preferredCountries.length));
        }
      });
    }
  }, {
    key: 'handleInput',
    value: function handleInput(event) {

      var formattedNumber = '+',
          newSelectedCountry = this.state.selectedCountry,
          freezeSelection = this.state.freezeSelection;

      //Does not exceed 16 digit phone number limit
      if (event.target.value.replace(/\D/g, '').length > 16) {
        return;
      }

      // if the input is the same as before, must be some special key like enter etc.
      if (event.target.value === this.state.formattedNumber) {
        return;
      }

      // ie hack
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      if (event.target.value.length > 0) {
        // before entering the number in new format, lets check if the dial code now matches some other country
        var inputNumber = event.target.value.replace(/\D/g, '');

        // we don't need to send the whole number to guess the country... only the first 6 characters are enough
        // the guess country function can then use memoization much more effectively since the set of input it gets has drastically reduced
        if (!this.state.freezeSelection || this.state.selectedCountry.dialCode.length > inputNumber.length) {
          newSelectedCountry = this.guessSelectedCountry(inputNumber.substring(0, 6), this.state.onlyCountries);
          freezeSelection = false;
        }
        // let us remove all non numerals from the input
        formattedNumber = this.formatNumber(inputNumber, newSelectedCountry.format);
      }

      var caretPosition = event.target.selectionStart;
      var oldFormattedText = this.state.formattedNumber;
      var diff = formattedNumber.length - oldFormattedText.length;

      this.setState({
        formattedNumber: formattedNumber,
        freezeSelection: freezeSelection,
        selectedCountry: newSelectedCountry.dialCode.length > 0 ? newSelectedCountry : this.state.selectedCountry
      }, function () {
        if (isModernBrowser) {
          if (diff > 0) {
            caretPosition = caretPosition - diff;
          }

          if (caretPosition > 0 && oldFormattedText.length >= formattedNumber.length) {
            _reactDom2.default.findDOMNode(this.refs.numberInput).setSelectionRange(caretPosition, caretPosition);
          }
        }

        if (this.props.onChange) {
          this.props.onChange(this.state.formattedNumber);
        }
      });
    }
  }, {
    key: 'handleInputClick',
    value: function handleInputClick(evt) {
      this.setState({ showDropDown: false });
      if (this.props.onClick) {
        this.props.onClick(evt);
      }
    }
  }, {
    key: 'handleFlagItemClick',
    value: function handleFlagItemClick(country) {
      var _this3 = this;

      var currentSelectedCountry = this.state.selectedCountry;
      var nextSelectedCountry = (0, _collection.find)(this.state.onlyCountries, country);

      if (currentSelectedCountry.iso2 !== nextSelectedCountry.iso2) {
        (function () {
          // TODO - the below replacement is a bug. It will replace stuff from middle too
          var newNumber = _this3.state.formattedNumber.replace(currentSelectedCountry.dialCode, nextSelectedCountry.dialCode);
          var formattedNumber = _this3.formatNumber(newNumber.replace(/\D/g, ''), nextSelectedCountry.format);

          _this3.setState({
            showDropDown: false,
            selectedCountry: nextSelectedCountry,
            freezeSelection: true,
            formattedNumber: formattedNumber
          }, function () {
            this._cursorToEnd();
            if (this.props.onChange) {
              this.props.onChange(formattedNumber);
            }
          });
        })();
      }
    }
  }, {
    key: 'handleInputFocus',
    value: function handleInputFocus(evt) {
      var _this4 = this;

      // if the input is blank, insert dial code of the selected country
      if (_reactDom2.default.findDOMNode(this.refs.numberInput).value === '+') {
        this.setState({ formattedNumber: '+' + this.state.selectedCountry.dialCode }, function () {
          return setTimeout(_this4._cursorToEnd, 10);
        });
      }

      if (this.props.onFocus) {
        this.props.onFocus(evt);
      }
    }
  }, {
    key: '_getHighlightCountryIndex',
    value: function _getHighlightCountryIndex(direction) {
      // had to write own function because underscore does not have findIndex. lodash has it
      var highlightCountryIndex = this.state.highlightCountryIndex + direction;

      if (highlightCountryIndex < 0 || highlightCountryIndex >= this.state.onlyCountries.length + this.state.preferredCountries.length) {
        return highlightCountryIndex - direction;
      }

      return highlightCountryIndex;
    }
  }, {
    key: 'searchCountry',
    value: function searchCountry() {
      var probableCandidate = this._searchCountry(this.state.queryString) || this.state.onlyCountries[0];
      var probableCandidateIndex = _lodash2.default.findIndex(this.state.onlyCountries, probableCandidate) + this.state.preferredCountries.length;

      this.scrollTo(this.getElement(probableCandidateIndex), true);

      this.setState({
        queryString: '',
        highlightCountryIndex: probableCandidateIndex
      });
    }
  }, {
    key: 'handleKeydown',
    value: function handleKeydown(event) {
      var _this5 = this;

      if (!this.state.showDropDown) {
        return;
      }

      // ie hack
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      var _moveHighlight = function _moveHighlight(direction) {
        _this5.setState({ highlightCountryIndex: _this5._getHighlightCountryIndex(direction) }, function () {
          _this5.scrollTo(_this5.getElement(_this5.state.highlightCountryIndex), true);
        });
      };

      switch (event.which) {
        case keys.DOWN:
          _moveHighlight(1);
          break;
        case keys.UP:
          _moveHighlight(-1);
          break;
        case keys.ENTER:
          this.handleFlagItemClick(this.state.onlyCountries[this.state.highlightCountryIndex], event);
          break;
        case keys.ESC:
          this.setState({ showDropDown: false }, this._cursorToEnd);
          break;
        default:
          if (event.which >= keys.A && event.which <= keys.Z || event.which === keys.SPACE) {
            this.setState({
              queryString: this.state.queryString + String.fromCharCode(event.which)
            }, this.state.debouncedQueryStingSearcher);
          }
      }
    }
  }, {
    key: 'handleInputKeyDown',
    value: function handleInputKeyDown(event) {
      if (event.which === keys.ENTER) {
        this.props.onEnterKeyPress(event);
      }

      if (this.props.onKeyDown) {
        this.props.onKeyDown(event);
      }
    }
  }, {
    key: 'handleClickOutside',
    value: function handleClickOutside() {
      if (this.state.showDropDown) {
        this.setState({
          showDropDown: false
        });
      }
    }
  }, {
    key: 'getCountryDropDownList',
    value: function getCountryDropDownList() {
      var _this6 = this;

      var countries = this.state.preferredCountries.concat(this.state.onlyCountries);
      var countryDropDownList = _lodash2.default.map(countries, function (country, index) {
        var itemClasses = (0, _classnames2.default)({
          country: true,
          preferred: country.iso2 === 'us' || country.iso2 === 'gb',
          active: country.iso2 === 'us',
          highlight: _this6.state.highlightCountryIndex === index
        });

        var inputFlagClasses = 'flag ' + country.iso2;

        return _react2.default.createElement(
          'li',
          {
            ref: 'flag_no_' + index,
            key: 'flag_no_' + index,
            'data-flag-key': 'flag_no_' + index,
            className: itemClasses,
            'data-dial-code': '1',
            'data-country-code': country.iso2,
            onClick: _this6.handleFlagItemClick.bind(_this6, country) },
          _react2.default.createElement('div', { className: inputFlagClasses }),
          _react2.default.createElement(
            'span',
            { className: 'country-name' },
            country.name
          ),
          _react2.default.createElement(
            'span',
            { className: 'dial-code' },
            '+' + country.dialCode
          )
        );
      });

      var dashedLi = _react2.default.createElement('li', { key: 'dashes', className: 'divider' });
      // let's insert a dashed line in between preffered countries and the rest
      countryDropDownList.splice(this.state.preferredCountries.length, 0, dashedLi);

      var dropDownClasses = (0, _classnames2.default)({
        'country-list': true,
        'hide': !this.state.showDropDown
      });

      return _react2.default.createElement(
        'ul',
        { ref: 'flagDropdownList', className: dropDownClasses },
        countryDropDownList
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var wrapperClasses = (0, _classnames2.default)("react-tel-input", this.props.wrapperClassName);

      var arrowClasses = (0, _classnames2.default)({
        "arrow": true,
        "up": this.state.showDropDown
      });

      var isValidNumber = this.props.isValid(this.state.formattedNumber.replace(/\D/g, ''));

      var inputClasses = (0, _classnames2.default)({
        "form-control": true,
        "invalid-number": !isValidNumber
      }, this.props.className);

      var flagViewClasses = (0, _classnames2.default)({
        "flag-dropdown": true,
        "open-dropdown": this.state.showDropDown
      });

      var inputFlagClasses = (0, _classnames2.default)('flag', this.state.selectedCountry.iso2, { 'single': this.isSingleCountry() });

      return _react2.default.createElement(
        'div',
        { className: wrapperClasses },
        _react2.default.createElement('input', _extends({
          placeholder: '+1 (702) 123-4567'
        }, this.props, {
          onChange: this.handleInput,
          onClick: this.handleInputClick,
          onFocus: this.handleInputFocus,
          onKeyDown: this.handleInputKeyDown,
          value: this.state.formattedNumber,
          ref: 'numberInput',
          type: 'tel',
          className: inputClasses
        })),
        _react2.default.createElement(
          'div',
          { ref: 'flagDropDownButton', className: flagViewClasses, onKeyDown: this.handleKeydown },
          _react2.default.createElement(
            'div',
            {
              ref: 'selectedFlag',
              onClick: function onClick() {
                _this7.handleFlagDropdownClick;
              },
              className: 'selected-flag',
              title: this.state.selectedCountry.name + ': + ' + this.state.selectedCountry.dialCode },
            _react2.default.createElement(
              'div',
              { className: inputFlagClasses },
              this.isSingleCountry() ? null : _react2.default.createElement('div', { className: arrowClasses })
            )
          ),
          this.state.showDropDown ? this.getCountryDropDownList() : ''
        )
      );
    }
  }]);

  return ReactPhoneInput;
}(_react2.default.Component);

ReactPhoneInput.prototype._searchCountry = _lodash2.default.memoize(function (queryString) {
  if (!queryString || queryString.length === 0) {
    return null;
  }
  // don't include the preferred countries in search
  var probableCountries = (0, _collection.filter)(this.state.onlyCountries, function (country) {
    return _lodash2.default.startsWith(country.name.toLowerCase(), queryString.toLowerCase());
  });
  return probableCountries[0];
});

ReactPhoneInput.prototype.guessSelectedCountry = _lodash2.default.memoize(function (inputNumber, onlyCountries) {
  var secondBestGuess = _lodash2.default.find(allCountries, { iso2: this.props.defaultCountry }) || onlyCountries[0];
  if (_lodash2.default.trim(inputNumber) === '') {
    return secondBestGuess;
  }

  var bestGuess = _lodash2.default.reduce(onlyCountries, function (selectedCountry, country) {
    if (_lodash2.default.startsWith(inputNumber, country.dialCode)) {
      if (country.dialCode.length > selectedCountry.dialCode.length) {
        return country;
      }
      if (country.dialCode.length === selectedCountry.dialCode.length && country.priority < selectedCountry.priority) {
        return country;
      }
    }

    return selectedCountry;
  }, { dialCode: '', priority: 10001 });

  if (!bestGuess.name) {
    return secondBestGuess;
  }

  return bestGuess;
});

ReactPhoneInput.defaultProps = {
  value: '',
  autoFormat: true,
  preferredCountries: [],
  onlyCountries: [],
  excludeCountries: [],
  defaultCountry: allCountries[0].iso2,
  isValid: isNumberValid,
  flagsImagePath: './flags.png',
  onEnterKeyPress: function onEnterKeyPress() {}
};

ReactPhoneInput.propTypes = {
  value: _react2.default.PropTypes.string,
  autoFormat: _react2.default.PropTypes.bool,
  defaultCountry: _react2.default.PropTypes.string,
  onlyCountries: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string),
  preferredCountries: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string),
  wrapperClassName: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func,
  onFocus: _react2.default.PropTypes.func,
  onClick: _react2.default.PropTypes.func,
  onKeyDown: _react2.default.PropTypes.func
};

exports.default = ReactPhoneInput;

// React.render(
//   <ReactPhoneInput defaultCountry={'us'} preferredCountries={['us', 'de']} excludeCountries={'in'}/>,
//   document.getElementById('content'));