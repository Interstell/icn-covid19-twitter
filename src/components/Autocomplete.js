import React from "react";

class Autocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      matches: [],
      query: "",
      selected: false
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
  }

  handleKeyPress(event) {
    const { activeIndex, matches } = this.state;

    switch (event.which) {
      case 13: // Enter key
        if (matches.length) {
          this.props.onWordChosen(matches[activeIndex]);
          this.setState({
            activeIndex: 0,
            matches: [],
            query: "",
            selected: false
          });
        }
        break;
      case 38: // Up arrow
        this.setState({
          activeIndex: activeIndex >= 1 ? activeIndex - 1 : 0
        });
        break;
      case 40: // Down arrow
        this.setState({
          activeIndex:
            activeIndex < matches.length - 1
              ? activeIndex + 1
              : matches.length - 1
        });
        break;
      default:
        break;
    }
  }

  handleSelection(event, selection) {
    event.preventDefault();
    this.props.onWordChosen(selection);
    this.setState({
      activeIndex: 0,
      query: "",
      matches: [],
      selected: false
    });
  }

  updateQuery(e) {
    const { data } = this.props;

    if (!this.state.selected) {
      const query = e.target.value;
      this.setState({
        matches:
          query.length >= 2
            ? data.filter(
                item => item.toUpperCase().indexOf(query.toUpperCase()) >= 0
              )
            : [],
        query
      });
    } else {
      if (e.nativeEvent.inputType === "deleteContentBackward") {
        this.setState({
          matches: [],
          query: "",
          selected: false
        });
      }
    }
  }

  render() {
    const { label, name, placeholder } = this.props;
    const { activeIndex, matches, query } = this.state;

    return (
      <div className="field autocomplete-field" style={{marginLeft: '-24px'}}>
        {label && <label className="label is-medium">{label}</label>}
        <div className="control is-expanded">
          <div className={`dropdown ${matches.length > 0 ? "is-active" : ""}`}>
            <div className="dropdown-trigger">
              <input
                type="text"
                className="input is-medium"
                name={name}
                value={query}
                onChange={this.updateQuery}
                onKeyDown={this.handleKeyPress}
                placeholder={placeholder}
              />
            </div>
            <div className="dropdown-menu">
              {matches.length > 0 && (
                <div className="dropdown-content">
                  {matches.map((match, index) => (
                    <a
                      className={`dropdown-item ${
                        index === activeIndex ? "is-active" : ""
                      }`}
                      href="/"
                      key={match}
                      onClick={event => this.handleSelection(event, match)}
                    >
                      {match}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Autocomplete;
