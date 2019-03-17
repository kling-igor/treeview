import React, { PureComponent } from 'react'
import { createGlobalStyle } from 'styled-components'
import { FileTreeView } from './filetreeview'

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



export default class App extends PureComponent {

  constructor(props) {
    super(props)

    this.fileTreeView = new FileTreeView(this.onItemPress)
    this.fileTreeView.setTreeData(fileTree)


    gui.add(this, '__addTreeData')
    gui.add(this, '__selectItem')
  }

  onItemPress = item => {
    console.log('PRESSED:', item)
  }


  __addTreeData = () => {
    this.fileTreeView.setTreeData(newFileTree)
  }

  __selectItem = () => {
    this.fileTreeView.selectItem('/controllers/login.js')
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
    activeSelectionBackground: '#75715E', // List/Tree background color for the selected item when the list/tree is active.
    activeSelectionForeground: '#', // List/Tree foreground color for the selected item when the list/tree is active.
    focusBackground: '#414339', // List/Tree background color for the focused item when the list/tree is active.
    focusForeground: '#', // List/Tree foreground color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
    hoverBackground: '#3e3d32', // List/Tree background when hovering over items using the mouse.
    hoverForeground: '#', // List/Tree foreground when hovering over items using the mouse.
    inactiveSelectionBackground: '#414339', // List/Tree background color for the selected item when the list/tree is inactive.
    inactiveSelectionForeground: '#', // List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
    inactiveFocusBackground: '#', // List background color for the focused item when the list is inactive. An active list has keyboard focus, an inactive does not. Currently only supported in lists.
    invalidItemForeground: '#B89500', // List/Tree foreground color for invalid items, for example an unresolved root in explorer.
    errorForeground: '#F48771', //  #A1260D - light Foreground color of list items containing errors.
    warningForeground: '#4d9e4d' // #117711 - light Foreground color of list items containing warnings.
  }
}

//  editor
// back #272822
// front #f8f8f2