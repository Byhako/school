import React, { Component } from 'react'
import '@/styles/searchStudent.styl'

class SearchStudent extends Component {
  render () {
    return (
      <section className='container'>
        {this.props.children}
      </section>
    )
  }
}

export default SearchStudent
