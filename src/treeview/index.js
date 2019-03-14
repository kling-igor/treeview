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

const ListItemContainerStyle = styled.li`
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  background-color: transparent;
  line-height: 1.7em;
  color: #cacaca;

  cursor: pointer;
  /* -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none; */
  user-select: none;
  /* padding-left: ${({ depthLevel }) => 16 + depthLevel * 16}; */

  :hover {
    background-color: #414339;
  }
`

const ListItemInnerContainerStyle = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  margin-left: ${({ depthLevel }) => `${16 + depthLevel * 16}px`};
`

const NodeArrowStyle = styled.span`
  color: #ff0000;
  margin-right: 6px;
  display: inline-block;
  transform: ${({ ellapsed }) => (ellapsed ? 'rotate(-45deg)' : 'rotate(-90deg)')};
  transition: transform 200ms cubic-bezier(0.4, 1, 0.75, 0.9);

  ::after {
    content: '▾';
  }
`
const ListItemLabelStyle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ListStyle = styled.ul`
  position: relative;
  margin: 0;
  padding: 0;
  font-size: 13px;
  font-family: 'Open Sans', sans-serif;
  white-space: nowrap;
  overflow-y: auto;
  overflow-x: scroll;
  text-overflow: ellipsis;
  width: 100%;
  height: 100%;
`

const ListItemIconStyle = styled.img`
  margin-right: 4px;
`

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
    console.log(
      `RENDER: item:${JSON.stringify(item)} path:${path} depthLevel:${depthLevel} isNode:${isNode} ellapsed=${ellapsed}`
    )

    const name = this.itemKey(item)

    const fullPath = `${path}/${name}`

    const onListItemClick = () => this.onListItemClick(fullPath, isNode, ellapsed)

    const icon = false

    return (
      <ListItemContainerStyle key={fullPath} onClick={onListItemClick}>
        <ListItemInnerContainerStyle depthLevel={depthLevel}>
          {isNode && <NodeArrowStyle ellapsed={ellapsed} />}
          {icon && <ListItemIconStyle height="18" width="18" src={icon} />}
          <ListItemLabelStyle>{name}</ListItemLabelStyle>
        </ListItemInnerContainerStyle>
        {/* <span>M</span> */}
      </ListItemContainerStyle>
    )
  }

  render() {
    const { flatData } = this.props.data
    return <ListStyle>{flatData.map(this.renderItem)}</ListStyle>
  }
}
