import App, { Container } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
// client
import { ApolloProvider } from 'react-apollo'
import withApollo from '../src/utils/withApollo'
// state
import { Provider } from 'unstated'
import { DataContainer } from '../src/utils/unstated'
// jss
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import getPageContext from '../src/utils/getPageContext'
// css
import '../src/scss/material-kit-pro-react.css'
import '../src/scss/nprogress.css'
// progress bar
import NProgress from 'nprogress'
// fetch api ponyfill
import 'isomorphic-unfetch'

Router.events.on('routeChangeStart', () => {
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

let dataStore = new DataContainer()
class MyApp extends App {
  constructor(props) {
    super(props)
    this.pageContext = getPageContext()
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/serviceWorker.js').catch((err) =>
        // eslint-disable-next-line no-console
        console.error('Service worker registration failed', err)
      )
    } else {
      // eslint-disable-next-line no-console
      console.log('Service worker not supported')
    }
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Provider inject={[dataStore]}>
            <Head>
              <title>Material Kit PRO React</title>
            </Head>
            {/* Wrap every page in Jss and Theme providers */}
            <JssProvider
              registry={this.pageContext.sheetsRegistry}
              generateClassName={this.pageContext.generateClassName}
            >
              {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
              <MuiThemeProvider
                theme={this.pageContext.theme}
                sheetsManager={this.pageContext.sheetsManager}
              >
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server side. */}
                <Component pageContext={this.pageContext} {...pageProps} />
              </MuiThemeProvider>
            </JssProvider>
          </Provider>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApollo(MyApp)
