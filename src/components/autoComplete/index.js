import React, { Component } from 'react';
import './index.css';
import { debounce } from '../../utils/common';
import { getStocksList, getStockDetails } from '../../controller/api';
import { constants } from '../../utils/contants';

export default class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchStr: '',
      suggestions: [],
      isLoading: false,
      error: {
        status: false,
        message: 'Something went wron...'
      }
    };
    this.delayedCallback = debounce(this.fetchList, constants.DEBOUNCE_DELAY);
  }

  onInputChangeHandler = e => {
    const { value } = e.target;
    this.setState({ searchStr: value });
    this.delayedCallback();
  };

  fetchList = async () => {
    const { searchStr } = this.state;
    if (!searchStr) return

    this.setState({ isLoading: true });
    try {
      const data = await getStocksList(searchStr);
      this.setState({ suggestions: data && data.bestMatches });
    } catch (error) {
      this.setState({ error });
      setTimeout(() => {
        this.setState({ error: { status: false, message: '' } })
      }, 5000);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onItemClick = (item) => {
    this.getStockDetails(item)
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { searchStr } = this.state;
    this.getStockDetails(searchStr);
  }

  getStockDetails = async (value) => {
    if (!value) return
    this.setState({ isLoading: true });

    try {
      const data = await getStockDetails(value);
      this.setState({ searchStr: '', suggestions: [] });
      const { onSelectItem } = this.props;
      onSelectItem && onSelectItem(data);

    } catch (error) {
      this.setState({ error: error, searchStr: '', suggestions: [] });
      setTimeout(() => {
        this.setState({ error: { status: false, message: '' } })
      }, 4000)
    } finally {
      this.setState({ isLoading: false, searchStr: '' });
    }
  }

  render() {
    const { suggestions, isLoading, error, searchStr } = this.state;

    const suggestionsList = suggestions && suggestions.map(e => {
      return (
        <li
          key={e[constants.symbol]}
          onClick={() => this.onItemClick(e[constants.symbol])}
          className="listItem"
        >

          <span>{e[constants.name]}</span>
          <span className="symbol">({e[constants.symbol]})</span>
        </li>
      );
    });
    const canShow = suggestions && suggestions.length > 0 && !isLoading;

    return (
      <div className="main-wrapper">
        <form className={`control ${isLoading ? 'isLoading' : ''}`} onSubmit={this.onSubmit}>
          <input
            type="search"
            className="searchBox"
            onChange={this.onInputChangeHandler}
            value={searchStr}
            placeholder="search"
          />
          <button type="submit" className="button"> Submit </button>
        </form>
        {isLoading && <span className="loader">{constants.Loading}</span>}
        {error.status && <span className="error"> {error.message}</span>}
        {canShow && (
          <div className="displayArea isHoverable">
            {suggestionsList}
          </div>
        )}
      </div>
    );
  }
}