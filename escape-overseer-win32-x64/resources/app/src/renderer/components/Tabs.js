// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Intl from 'grommet/utils/Intl';
import CSSClassnames from 'grommet/utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.TABS;

export default class Tabs extends Component {

  constructor(props, context) {
    super(props, context);

    this._activateTab = this._activateTab.bind(this);

    this.state = {
      activeIndex: props.activeIndex || 0,
      justify: props.justify
    };
  }

  _activateTab (index) {
    if (! this.props.hasOwnProperty('activeIndex')) {
      this.setState({ activeIndex: index });
    }
  }

  render () {
    const { children, className, justify, responsive, ...props } = this.props;
    const { activeIndex } = this.state;
    const { intl } = this.context;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--justify-${justify}`]: justify,
        [`${CLASS_ROOT}--responsive`]: responsive
      },
      className
    );

    let activeContainer;
    let activeTitle;
    const tabs = React.Children.map(children, (tab, index) => {
      if (!tab) return null;

      const tabProps = tab.props || tab._store.props || {};

      const isTabActive = index === activeIndex;

      if (isTabActive) {
        activeTitle = tabProps.title;
      }

      return React.cloneElement(tab, {
        active: isTabActive,
        id: `tab-${index}`,
        onRequestForActive: () => {
          this._activateTab(index);
        }
      });
    }, this);

    const containers = React.Children.map(children, (tab, index) => {
        if (!tab) return null;
  
        const tabProps = tab.props || tab._store.props || {};
  
        const isTabActive = index === activeIndex;
  
        return React.cloneElement(tabProps.children, {
          style: {display: isTabActive ? 'block' : 'none'}
        });
      }, this);

    const tabContentTitle = Intl.getMessage(intl, 'Tab Contents', {
      activeTitle: activeTitle
    });

    return (
      <div role='tablist'>
        <ul {...props} className={classes}>
          {tabs}
        </ul>
        <ul aria-label={tabContentTitle} role='tabpanel'>
          {containers}
        </ul>
      </div>
    );
  }
}

Tabs.propTypes = {
  activeIndex: PropTypes.number,
  justify: PropTypes.oneOf(['start', 'center', 'end']),
  responsive: PropTypes.bool,
  onActive: PropTypes.func
};

Tabs.contextTypes = {
  intl: PropTypes.object
};

Tabs.defaultProps = {
  justify: 'center',
  responsive: true
};
