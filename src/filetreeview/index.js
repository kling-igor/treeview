import React from 'react'
import { TreeView, TreeViewModel } from '../treeview'

export const ICONS_PATH = 'assets/icons'

const getFileName = ({ fileName }) => fileName

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

export class FileTreeView {
  constructor(onItemPress) {
    this.model = new TreeViewModel(getFileName)

    this._widget = <TreeView data={this.model} itemKey={getFileName} nodeIcon={nodeIcon} onItemPress={onItemPress} />
  }

  setTreeData(data) {
    this.model.setTreeData(data)
  }

  get widget() {
    return this._widget
  }

  dispose() {
    this.model = null
    this._widget = null
  }
}

/*
export default {
  subscriptions: null,

  projectSubscriptions: null

  activate() {

    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(vision.workspace.on('workspace:project-open', () => {

      this.projectSubscriptions = new CompositeDisposable()

      const fileTreeView = new FileTreeView

      fileTreeView.setTreeData(vision.project.files)

      this.projectSubscriptions.add(vision.project.on('project:files-changed', () => {
        fileTreeView.setTreeData(vision.project.files)
      }))

      vision.workspace.getDocker().addPane(vision.project.name, fileTreeView)

      this.projectSubscriptions.add(fileTreeView.on('treeview:item-select', path => {
        vision.workspace.open(path)
      }))

    }))

    this.subscriptions.add(vision.workspace.on('workspace:project-will-close', () => {
      vision.workspace.getDocker().removePane(vision.project.name)
      // у удаляемого компонента попытается вызвать dispose

      this.projectSubscriptions.dispose()
      this.projectSubscriptions = null
    }))

  },

  deactivate() {
    this.subscriptions.dispose()
    this.subscriptions = null
  },
}
*/