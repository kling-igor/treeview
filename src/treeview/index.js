import React, { Component } from 'react'
import { observalbe, computed, observable, action } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const flatTree = itemKey => (tree, path = '', flattenTree = [], depthLevel = 0) => {
  tree.reduce((accum, item) => {
    const { children, ellapsed = false, ...rest } = item

    let flatItem = { item: rest, path, depthLevel }

    if (children) {
      flatItem = { ...flatItem, isNode: true, ellapsed }
    }

    console.log('* ', flatItem)

    accum.push(flatItem)

    if (children && ellapsed) {
      flatTree(itemKey)(children, `${path}/${itemKey(item)}`, accum, depthLevel + 1)
    }

    return accum
  }, flattenTree)

  if (depthLevel === 0) {
    return flattenTree
  }
}

export class TreeViewModel {
  @observable.ref treeData = []

  // линеаризованное дерево
  @computed get flatData() {
    return this.flatTree(this.treeData)
  }

  @action.bound
  setTreeData(treeData) {
    // тут должно происходить сравнение деревьев
    // новое дерево получает все состояния ellapsed из старого

    this.treeData = treeData
  }

  fold = fullPath => {
    const node = this.findNode(fullPath)

    if (node) {
      node.ellapsed = false
      this.setTreeData([...this.treeData])
    }
  }

  unfold = fullPath => {
    const node = this.findNode(fullPath)
    if (node) {
      node.ellapsed = true
      this.setTreeData([...this.treeData])
    }
  }

  findNode = path => {
    const pathParts = path.split('/').slice(1)

    let pathItem = pathParts.shift()

    const traverse = (node, pathItem) => {
      const key = this.itemKey(node)
      // если имя нода совпадает в пути
      if (key === pathItem) {
        // если путь исчерпан
        if (pathParts.length === 0) {
          return node
        }

        // углубляем поиск
        const { children } = node
        if (children) {
          pathItem = pathParts.shift()
          for (let i = 0; i < children.length; i++) {
            const foundNode = traverse(children[i], pathItem)
            if (foundNode) {
              return foundNode
            }
          }
        }
      }
    }

    for (let i = 0; i < this.treeData.length; i++) {
      const foundNode = traverse(this.treeData[i], pathItem)
      if (foundNode) {
        return foundNode
      }
    }
  }

  constructor(itemKey) {
    this.itemKey = itemKey
    this.flatTree = flatTree(itemKey)
  }
}

@observer
export class TreeView extends Component {
  constructor(props) {
    super(props)
    this.itemKey = this.props.itemKey || (f => f)
  }

  onListItemClick = (fullPath, isNode = false, ellapsed = false) => {
    if (isNode) {
      if (ellapsed) {
        this.props.data.fold(fullPath)
      } else {
        this.props.data.unfold(fullPath)
      }
    } else {
      if (this.props.onItemPress) {
        this.props.onItemPress(fullPath)
      }
    }
  }

  renderItem = ({ item, path, depthLevel, isNode, ellapsed }) => {
    const name = this.itemKey(item)

    const fullPath = `${path}/${name}`

    const onListItemClick = () => this.onListItemClick(fullPath, isNode, ellapsed)

    return (
      <li
        key={fullPath}
        style={{
          paddingLeft: 16 + depthLevel * 16
        }}
        onClick={onListItemClick}
      >
        {name}
      </li>
    )
  }

  render() {
    const { flatData } = this.props.data
    return <ul>{flatData.map(this.renderItem)}</ul>
  }
}
