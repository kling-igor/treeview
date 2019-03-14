import React, { PureComponent } from 'react'

import { createGlobalStyle } from 'styled-components'

import { FileTreeView } from './filetreeview'
import { POINT_CONVERSION_COMPRESSED } from 'constants';

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


const newFileTree = [
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
  },
  {
    fileName: '.gitignore'
  }
]



const gui = new dat.GUI();

// const obj = {
//   foo: 'foo',
//   boolean: false,
//   func: () => {
//     console.log('FUNC!!!')
//   }
// }

// gui.add(obj, 'foo')
// gui.add(obj, 'func')
// gui.add(obj, 'boolean')



export default class App extends PureComponent {

  constructor(props) {
    super(props)

    this.fileTreeView = new FileTreeView(this.onItemPress)
    this.fileTreeView.setTreeData(fileTree)


    gui.add(this, 'addTreeData')
  }

  onItemPress = item => {
    console.log('PRESSED:', item)
  }


  addTreeData = () => {
    this.fileTreeView.setTreeData(newFileTree)
  }


  render() {
    return (
      <>
        <GlobalStyle />
        {this.fileTreeView.widget}
      </>
    )
  }
}


const theme = {
  list: {
    activeSelectionBackground: '#', // List/Tree background color for the selected item when the list/tree is active.
    activeSelectionForeground: '#', // List/Tree foreground color for the selected item when the list/tree is active.
    focusBackground: '#', // List/Tree background color for the focused item when the list/tree is active.
    focusForeground: '#', // List/Tree foreground color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
    hoverBackground: '#', // List/Tree background when hovering over items using the mouse.
    hoverForeground: '#', // List/Tree foreground when hovering over items using the mouse.
    inactiveSelectionBackground: '#', // List/Tree background color for the selected item when the list/tree is inactive.
    inactiveSelectionForeground: '#', // List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
    inactiveFocusBackground: '#', // List background color for the focused item when the list is inactive. An active list has keyboard focus, an inactive does not. Currently only supported in lists.
    invalidItemForeground: '#', // List/Tree foreground color for invalid items, for example an unresolved root in explorer.
    errorForeground: '#', // Foreground color of list items containing errors.
    warningForeground: '#' // Foreground color of list items containing warnings.
  }
}