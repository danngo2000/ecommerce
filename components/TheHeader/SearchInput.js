import React, { memo } from 'react'
import Router from 'next/router'
import axios from 'axios'
import debounce from 'lodash.debounce'
import Link from 'next/link'
import { connect, useSelector } from 'react-redux'
import { Button } from 'antd'
import {
  RiseOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  SearchOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { Drawer as ADrawer } from 'antd'
// import { toggleBackgroundFilter } from 'actions/ui'

const SearchForm = (props) => {
  const {
    keyword,
    onInputChange,
    onKeyDown,
    onSearchClick,
    leftElement,
    autoFocus,
    renderCartIcon
  } = props
  const _config = useSelector((state) => state.config)
  const cart = useSelector((state) => state.cart)
  const theme = _config['site/theme']
  let placeholder = 'Search'
  return (
    <div className='bp3-drawer-header'>
      {leftElement}
      <div className='bp3-input-group'>
        <input
          autoFocus={autoFocus}
          style={{ lineHeight: '20px', minHeight: 33 }} // fix dont show value on Iphone
          className='bp3-input searchBarInput'
          type='text'
          placeholder={placeholder}
          value={keyword || ''}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
        <Button
          intent='success'
          className={`input-search ${theme}`}
          icon={<SearchOutlined />}
          type='ghost'
          onClick={onSearchClick}
        />
      </div>
      {renderCartIcon && (
        <div className='icon'>
          <Link href='/cart'>
            <a>
              <div className={`countNumber cartDialog ${theme}`}>
                {cart &&
                  cart.items_count !== 0 &&
                  cart.items_count !== null && <span>{cart.items_count}</span>}
              </div>
              <img src='/static/images/svg/black-cart.svg' alt='' />
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

const Suggestion = memo((props) => {
  const {
    suggestKeywords,
    suggestTrending,
    recentKeywords,
    display,
    onClick,
    onRecentRemove,
    onAllRecentsRemove
  } = props

  return (
    <div
      className='suggestion bp3-drawer-body'
      id='suggestion'
      style={{ display }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {(!Array.isArray(suggestKeywords) || suggestKeywords.length === 0) && (
        <>
          {Array.isArray(recentKeywords) && recentKeywords.length > 0 && (
            <div className='keywords lso-keywords'>
              <h5 className='bp3-heading'>
                <ClockCircleOutlined />
                {/* &nbsp;{t('Recent Searches')} */}
                &nbsp;Recent Searches
                <Button
                  className='clear-all'
                  type='ghost'
                  onClick={(e) => onAllRecentsRemove(e)}
                >
                  {/* {t('Clear All')} */}
                  Clear All
                </Button>
              </h5>
              {recentKeywords.map((recent, i) => (
                <div className='lso-keyword' key={i}>
                  <Link as={`/s/${recent}`} href={`/search?q=${recent}`}>
                    <a onClick={() => onClick(recent)}>
                      <div className='keyword'>{recent}</div>
                    </a>
                  </Link>
                  <Button
                    icon={<CloseOutlined />}
                    className='remove-recent'
                    type='ghost'
                    onClick={(e) => onRecentRemove(e, recent)}
                  />
                </div>
              ))}
            </div>
          )}
          {Array.isArray(suggestTrending) && suggestTrending.length > 0 && (
            <div className='keywords lso-keywords'>
              <h5 className='bp3-heading'>
                <RiseOutlined />
                {/* &nbsp;{t('Trending Searches')} */}
                &nbsp;Trending Searches
              </h5>
              {suggestTrending.map((trending, i) => (
                <div className='lso-keyword' key={i}>
                  <Link
                    as={`/s/${trending}`}
                    href={`/search?q=${trending}`}
                    key={i}
                  >
                    <a onClick={() => onClick(trending)}>
                      <div className='keyword'>{trending}</div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {Array.isArray(suggestKeywords) && suggestKeywords.length > 0 && (
        <div className='keywords'>
          {suggestKeywords.map((keyword, index) => (
            <Link
              as={`/s/${keyword}`}
              href={`/search?q=${keyword}`}
              key={index}
            >
              <a onClick={() => onClick(keyword)}>
                <div className='keyword'>{keyword}</div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
})

class SearchInputWrapper extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      keyword: props.q,
      suggestKeywords: [],
      suggestProducts: [],
      recentKeywords: [],
      displaySuggestion: 'none',
      displayDialog: false
    }
    this.mainRef = React.createRef()
  }

  componentDidMount() {
    let recentSearches = []
    let recentStorage =
      window &&
      window.localStorage &&
      window.localStorage.getItem('recentSearches' || '')
    try {
      recentSearches = JSON.parse(recentStorage && recentStorage)
    } catch (e) {
      console.log(e.message)
    } finally {
      this.setState({
        recentKeywords: recentSearches ? recentSearches.reverse() : []
      })
      window.addEventListener('resize', this.handWindowRezise)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handWindowRezise)
  }

  handWindowRezise = () => {
    if (window.innerWidth >= 996) this.handleBlur()
  }

  saveKeyword = (keyword) => {
    let recentSearches = []
    try {
      recentSearches = JSON.parse(window.localStorage.getItem('recentSearches'))
    } catch (e) {
    } finally {
      const keywordSet = new Set(recentSearches)
      if (keywordSet.has(keyword)) keywordSet.delete(keyword)
      keywordSet.add(keyword)
      window.localStorage.setItem(
        'recentSearches',
        JSON.stringify([...keywordSet])
      )
      this.setState({ recentKeywords: [...keywordSet].reverse() })
    }
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const k = this.state.keyword && this.state.keyword.trim()
      this.saveKeyword(k)
      this.gotoSearchPage(k)
      document.activeElement.blur()
    }
  }

  handleRemoveAllRecents = (e) => {
    e.preventDefault()
    window.localStorage.setItem('recentSearches', [])
    this.setState({ recentKeywords: [] })
  }

  handleRemoveRecent = (e, k) => {
    e.preventDefault()
    let recentSearches = []
    try {
      recentSearches = JSON.parse(window.localStorage.getItem('recentSearches'))
    } finally {
      const keywordSet = new Set(recentSearches)
      keywordSet.delete(k)
      window.localStorage.setItem(
        'recentSearches',
        JSON.stringify([...keywordSet])
      )
      this.setState({ recentKeywords: [...keywordSet].reverse() })
    }
  }

  getSuggestion = debounce(async (keyword) => {
    const suggestKeywords = []
    const suggestProducts = []
    if (!keyword) {
      this.setState({
        suggestKeywords,
        suggestProducts
      })
      return true
    }
    try {
      const {
        data: { suggest }
      } = await axios.get(`products/suggest?keyword=${keyword}`)
      for (let i in suggest) {
        let tmp = suggest[i].text.split(' ')
        let keyword = tmp[0]
        if (tmp[1]) keyword += ' ' + tmp[1]
        if (suggestKeywords.indexOf(keyword) === -1) {
          suggestKeywords.push(keyword)
        }
        // suggestProducts.push(suggest[i]._source)
      }
      this.setState({
        suggestKeywords,
        suggestProducts
      })
    } catch (e) {
      console.log(e)
    }
  }, 400)

  handleSearchClick = () => {
    const k = this.state.keyword && this.state.keyword.trim()
    this.saveKeyword(k)
    this.gotoSearchPage(k)
    this.setState({ displaySuggestion: 'none', displayDialog: false })
    // this.props.toggleBackgroundFilter(false)
  }

  gotoSearchPage = (keyword) => {
    Router.push(`/search?q=${keyword}`, `/s/${keyword}`)
    this.setState({ displaySuggestion: 'none', displayDialog: false })
    // this.props.toggleBackgroundFilter(false)
    window.document.body.scrollTop = 0 // For Safari
    window.document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
  }

  hanleInputChange = (e) => {
    const keyword = e.target.value
    this.setState({ keyword })
    this.getSuggestion(keyword.trim())
  }

  handleBlur = () => {
    if (this.state.displaySuggestion === 'block') {
      this.setState({ displaySuggestion: 'none' })
      // this.props.toggleBackgroundFilter(false)
    }
    // document.body.classList.remove('bodyFixed')
  }

  handleFocus = (e) => {
    if (window.innerWidth < 996) {
      e.preventDefault()
      this.setState({ displayDialog: true, displaySuggestion: 'none' })
      return
    } else {
      // document.body.classList.add('bodyFixed')
    }
    if (this.state.displaySuggestion === 'none') {
      this.setState({ displaySuggestion: 'block' })
      // this.props.toggleBackgroundFilter(true)
    }
  }

  handleSuggestionClick = (keyword, shouldSaveKeyword = true) => {
    if (shouldSaveKeyword) this.saveKeyword(keyword)
    this.setState({
      displaySuggestion: 'none',
      keyword,
      displayDialog: false
    })
    // this.props.toggleBackgroundFilter(false)
  }

  render() {
    const {
      keyword,
      suggestKeywords,
      displaySuggestion,
      recentKeywords,
      displayDialog
    } = this.state
    const searchInputProps = {
      keyword,
      onInputChange: this.hanleInputChange,
      onKeyDown: this.handleKeyDown,
      onSearchClick: this.handleSearchClick,
      onSuggestionClick: this.handleSuggestionClick,
      onRecentRemove: this.handleRemoveRecent,
      onAllRecentsRemove: this.handleRemoveAllRecents,
      suggestTrending: this.props.config['search/trendingSearches'] || '',
      suggestKeywords,
      recentKeywords
    }
    return (
      <div onFocus={this.handleFocus} onBlur={this.handleBlur}>
        <SearchInputDialog
          onClose={() => this.setState({ displayDialog: false })}
          isOpen={displayDialog}
          {...searchInputProps}
        />
        <SearchInput
          keyword={keyword}
          display={displaySuggestion}
          {...searchInputProps}
        />
      </div>
    )
  }
}

const SearchInput = memo((props) => {
  const {
    keyword,
    onInputChange,
    onKeyDown,
    onSearchClick,
    onSuggestionClick,
    onRecentRemove,
    suggestTrending,
    onAllRecentsRemove,
    suggestKeywords,
    recentKeywords,
    display,
    leftElement,
    autoFocus,
    renderCartIcon
  } = props
  return (
    <>
      {React.createElement(SearchForm, {
        keyword,
        onInputChange,
        onKeyDown,
        onSearchClick,
        leftElement,
        autoFocus,
        renderCartIcon
      })}
      {React.createElement(Suggestion, {
        onClick: onSuggestionClick,
        onRecentRemove,
        suggestTrending,
        suggestKeywords,
        recentKeywords,
        onAllRecentsRemove,
        display
      })}
    </>
  )
})

const SearchInputDialog = ({ isOpen, onClose, ...props }) => {
  return (
    <ADrawer visible={isOpen} className='lso-search-dialog' width='100%'>
      <SearchInput
        {...props}
        autoFocus
        renderCartIcon
        leftElement={
          <Button
            class
            icon={<ArrowLeftOutlined />}
            type='ghost'
            onClick={onClose}
          />
        }
      />
    </ADrawer>
  )
}

const mapState = (state) => ({
  config: state.config
})

export default connect(mapState)(SearchInputWrapper)
