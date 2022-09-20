// eslint-disable-next-line @typescript-eslint/no-var-requires
const mainFragmentGLSL = require('./shaders/main.frag')

function loadShader(shaderToLoad) {
  return fetch(shaderToLoad, { method: 'GET' }).then((res) => res.text())
}

export const resources = {
  shaders: {
    main: null as string | null,
  },
}

export async function loadResources() {
  resources.shaders.main = await loadShader(mainFragmentGLSL)

  return resources
}
