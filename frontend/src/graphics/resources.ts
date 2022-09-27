function removeComments(code: string) {
  return code.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
}

function loadShader(shaderToLoad) {
  return fetch(shaderToLoad, { method: 'GET' })
    .then((res) => res.text())
    .then(removeComments)
}

export const resources = {
  shaders: {
    mainFragment: null as string | null,
    mainVertex: null as string | null,
  },
  textures: {
    cat: null as HTMLCanvasElement | HTMLImageElement | null,
  },
}

export async function loadResources() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  resources.shaders.mainFragment = await loadShader(require('../assets/shaders/main.frag'))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  resources.shaders.mainVertex = await loadShader(require('../assets/shaders/main.vert'))

  return resources
}
