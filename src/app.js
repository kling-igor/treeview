import React, { PureComponent } from 'react'

import { createGlobalStyle } from 'styled-components'

import { TreeViewModel, TreeView } from './treeview'

export const ICONS_PATH = 'assets/icons'

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

    background: #1c1c1c;
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
    fileName: 'controllers',
    children: [{ fileName: 'login.js' }, { fileName: 'main.js' }]
  },
  {
    fileName: 'models',
    children: [{ fileName: 'model1.js' }, { fileName: 'model2.js' }]
  },
  {
    fileName: 'styles',
    children: [{ fileName: 'style1.json' }, { fileName: 'style2.json' }]
  },
  {
    fileName: 'views',
    children: [{ fileName: 'login.json' }, { fileName: 'main.json' }]
  },
  {
    fileName: 'README.md'
  },
  {
    fileName: 'package.json'
  }
]

fileTreeModel.setTreeData(fileTree)

const specialFiles = {
  'package.json': 'npm.svg'
}

const fileExtensions = {
  js: 'javascript.svg',
  json: 'json.svg',
  md: 'markdown.svg',
  txt: 'file.svg'
}

const fileExtensionRegex = /\.([0-9a-z]{1,5})$/i

const nodeIcon = (name, ellapsed = false, depthLevel = 0) => {
  let icon

  if (depthLevel === 0) {
    if (name === 'controllers') {
      icon = ellapsed ? `folder-src-open.svg` : `folder-src.svg`
    } else if (name === 'views') {
      icon = ellapsed ? `folder-layout-open.svg` : `folder-layout.svg`
    } else if (name === 'styles') {
      icon = ellapsed ? `folder-css-open.svg` : `folder-css.svg`
    } else if (name === 'models') {
      icon = ellapsed ? `folder-database-open.svg` : `folder-database.svg`
    }

    if (!icon) {
      icon = specialFiles[name]
    }
  }

  if (!icon) {
    const extensionMatch = name.match(fileExtensionRegex)

    if (extensionMatch) {
      const extension = extensionMatch[1]
      if (extension) {
        icon = fileExtensions[extension.toLowerCase()]
      }
    }
  }

  if (icon) return `${ICONS_PATH}/${icon}`
}

export default class App extends PureComponent {
  onItemPress = item => {
    console.log('PRESSED:', item)
  }

  render() {
    return (
      <>
        <GlobalStyle />
        <TreeView data={fileTreeModel} itemKey={getFileName} nodeIcon={nodeIcon} onItemPress={this.onItemPress} />
      </>
    )
  }
}
