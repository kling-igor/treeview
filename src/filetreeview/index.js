import React from 'react'
import { TreeView, TreeViewModel } from '../treeview'

import fileIcon from './fileIcon'

const getFileName = ({ fileName }) => fileName


// на этом уровне происходит связка с event и передача воздейтствий в модель императивнм способом


export class FileTreeView {
  constructor(onItemPress) {
    this.model = new TreeViewModel(getFileName, onItemPress)
    this._widget = <TreeView data={this.model} onItemPress={this.model.onItemSelect} itemKey={getFileName} nodeIcon={fileIcon('assets/icons')} />
  }

  setTreeData(data) {
    this.model.setTreeData(data)
  }

  get widget() {
    return this._widget
  }

  setItemSelected(path) {
    this.model.setItemSelected(path)
  }

  dispose() {
    this.model = null
    this._widget = null
  }
}

// пример того, как мог бы выглядеть модуль
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