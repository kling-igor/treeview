import React, { Component } from 'react'
import { observer } from 'mobx-react'
import styled, { withTheme } from 'styled-components'


const ListItemContainerStyle = styled.li`
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ selected, theme: { list: { activeSelectionBackground } } }) => selected ? activeSelectionBackground : 'transparent'};
  line-height: 1.7em;
  color: ${({ theme: { foreground } }) => foreground};

  cursor: pointer;
  user-select: none;

  :hover {
    background-color: ${({ selected, theme: { list: { activeSelectionBackground, hoverBackground } } }) => selected ? activeSelectionBackground : hoverBackground};
  }
`

const ListItemInnerContainerStyle = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  margin-left: ${({ depthLevel, isNode }) => `${depthLevel * 16 + (isNode ? 0 : 8)}px`};
`

const NodeArrowStyle = styled.span`
  color: ${({ theme: { type } }) => type === 'dark' ? 'white' : 'black'};
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


export const TreeView = withTheme(observer(class extends Component {
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

  renderItem = ({ item, path, depthLevel, isNode, ellapsed, selected }) => {
    const name = this.itemKey(item)

    const fullPath = `${path}/${name}`

    const onListItemClick = () => this.onListItemClick(fullPath, isNode, ellapsed)

    const icon = this.props.nodeIcon ? this.props.nodeIcon(name, ellapsed, depthLevel) : false

    return (
      <ListItemContainerStyle key={fullPath} onClick={onListItemClick} selected={selected}>
        <ListItemInnerContainerStyle depthLevel={depthLevel} isNode={isNode}>
          {isNode && <NodeArrowStyle ellapsed={ellapsed} theme={this.props.theme} />}
          {icon && <ListItemIconStyle height="16" width="16" src={icon} />}
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
}))
