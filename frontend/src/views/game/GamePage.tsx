import { useRef, useEffect } from 'react'
import { Renderer } from '../../graphics/renderer'
import './GamePage.css'

export const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const renderer = new Renderer(canvasRef.current)
    renderer.draw()

    return () => renderer.destroy()
  }, [])

  return (
    <div className="game-page">
      <canvas ref={canvasRef} />
    </div>
  )
}
