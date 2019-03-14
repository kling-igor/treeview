import React, { PureComponent } from 'react'

import { createGlobalStyle } from 'styled-components'

import { TreeViewModel, TreeView } from './treeview'

const GlobalStyle = createGlobalStyle`
  html {
    
    height: 100%;
    margin: 0;
  }

  body {
    padding: 0;
    margin: 0;
    font-family: Roboto, sans-serif;
    overflow: hidden;
    background-color: white;
    height: 100%;
    margin: 0;
    overflow: hidden !important;
  }

  #app {
    min-height: 100%;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    padding: 8px;
  }
`

const getFileName = ({ fileName }) => fileName

const fileTreeModel = new TreeViewModel(getFileName)

const fileTree = [
  {
    fileName: 'folder',
    children: [
      { fileName: 'c1.js', children: [{ fileName: 'd1.js' }, { fileName: 'd2.js' }] },
      { fileName: 'b1.js' },
      { fileName: 'b2.js' }
    ]
  },
  { fileName: 'a.js' }
]

fileTreeModel.setTreeData(fileTree)

export default class App extends PureComponent {
  onItemPress = item => {
    console.log('PRESSED:', item)
  }

  render() {
    return (
      <>
        <GlobalStyle />
        <TreeView data={fileTreeModel} itemKey={getFileName} onItemPress={this.onItemPress} />
      </>
    )
  }
}
