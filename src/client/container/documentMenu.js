import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { loadList } from '../action/document';
import DocumentSpan from '../component/documentSpan';

import __ from '../lang';

class DocumentMenu extends Component {
  render() {
    return (
      <li>
        <div className='subcategory-name'>
          {__('DocumentsTitle')}
          {this.props.loading && <span className='load-icon' />}
          <Link className='add-icon' activeClassName='active'
            to='/new/document'
          />
        </div>
        <ul className='subcategory'>
          {
            this.props.list.map((document, i) => (
              <li key={document.id}>
                <DocumentSpan document={document}
                  documentPush={this.props.pushList[i]} />
              </li>
            ))
          }
        </ul>
      </li>
    );
  }
  componentWillUpdate(nextProps) {
    if (this.props.user == null && nextProps.user) {
      this.props.loadList();
    }
  }
  componentDidMount() {
    if (this.props.user != null) {
      this.props.loadList();
    }
  }
}

DocumentMenu.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool,
  list: PropTypes.array,
  pushList: PropTypes.array,
  loadList: PropTypes.func
};

export default connect(state => ({
  user: state.entities.users[state.user.username],
  loading: state.document.load && state.document.load.loading,
  list: (state.document.list || []).map(v => state.entities.documents[v]),
  pushList: (state.document.list || []).map(v => state.entities.documentPush[v])
}), { loadList })(DocumentMenu);
