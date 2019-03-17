

const specialFiles = {
  'package.json': 'npm.svg',
  '.gitignore': 'git.svg',
  '.npmrc': 'npm.svg',
}

const fileExtensions = {
  js: 'javascript.svg',
  json: 'json.svg',
  md: 'markdown.svg',
  txt: 'file.svg'
}

const fileExtensionRegex = /\.([0-9a-z]{1,5})$/i

const fileIcon = ICONS_PATH => (name, ellapsed = false, depthLevel = 0) => {
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

  if (!icon) {
    icon = file.svg
  }

  return `${ICONS_PATH}/${icon}`
}


export default fileIcon