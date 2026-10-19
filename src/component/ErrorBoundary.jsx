import { Component } from 'react'
import './Products.css'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Application render failed.', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <section className="products-message" role="alert">
          <h1>Something went wrong</h1>
          <p>{this.state.error.message}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Try again
          </button>
        </section>
      )
    }

    return this.props.children
  }
}