import { observalbe, computed, observable, action } from 'mobx'

const flatTree = itemKey => (tree, selectedItemPath = null, path = '', flattenTree = [], depthLevel = 0) => {
  tree.reduce((accum, item) => {
    const { children, ellapsed = false, ...rest } = item

    let flatItem = { item: rest, path, depthLevel }

    if (children) {
      flatItem = { ...flatItem, isNode: true, ellapsed }
    }

    if (selectedItemPath === `${path}/${itemKey(item)}`) {
      flatItem = { ...flatItem, selected: true }
    }

    accum.push(flatItem)

    if (children && ellapsed) {
      flatTree(itemKey)(children, selectedItemPath, `${path}/${itemKey(item)}`, accum, depthLevel + 1)
    }

    return accum
  }, flattenTree)

  if (depthLevel === 0) {
    return flattenTree
  }
}

export class TreeViewModel {
  @observable.ref treeData = []

  @observable selectedItemPath = null

  // линеаризованное дерево
  @computed get flatData() {
    return this.flatTree(this.treeData, this.selectedItemPath)
  }

  @action.bound
  setTreeData(treeData) {
    // сравнение деревьев и наследование аттрибута ellapsed от старого дерева
    // возможно придется и другие аттрибуты наследовать
    const traverse = (item, oldTreeData) => {
      if (Array.isArray(item.children)) {
        const newName = this.itemKey(item)
        const oldNode = oldTreeData.find(item => this.itemKey(item) === newName)

        if (oldNode && Array.isArray(oldNode.children)) {
          item.ellapsed = oldNode.ellapsed || false
          item.children.forEach(child => traverse(child, oldNode.children))
        }
      }
    }

    treeData.forEach(item => traverse(item, this.treeData))
    this.treeData = treeData
  }

  fold = fullPath => {
    const node = this.findNode(fullPath)

    if (node) {
      node.ellapsed = false
      this.treeData = [...this.treeData]
    }
  }

  unfold = fullPath => {
    const node = this.findNode(fullPath)
    if (node) {
      node.ellapsed = true
      this.treeData = [...this.treeData]
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

  // разворачивает дерево для выбираемого элемента
  // нужно для случав когда "выбор" осущуствляется искусственно
  setItemSelected = path => {
    const node = this.findNode(path)
    if (node) {
      this.selectedItemPath = path
      let folders = path.split('/').slice(1, -1)


      const traverse = (folders, treeData = []) => {
        const [folderName, ...rest] = folders

        if (folderName) {
          const node = treeData.find(item => this.itemKey(item) === folderName)
          if (node) {
            node.ellapsed = true
            traverse(rest, node.children)
          }
        }
      }

      traverse(folders, this.treeData)

      this.treeData = [...this.treeData]
    }
  }

  // для выбора, осуществляемого в компоннте
  onItemSelect = (path) => {
    this.selectedItemPath = path
    this.__onItemSelect(path)
  }

  constructor(itemKey, onItemSelect) {
    this.itemKey = itemKey
    this.__onItemSelect = onItemSelect
    this.flatTree = flatTree(itemKey, this.selectedItemPath)
  }
}