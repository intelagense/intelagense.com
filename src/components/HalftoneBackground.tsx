import { useEffect, useRef } from 'react'
import vertexShader from '../shaders/basic.vert'
import fragmentShader from '../shaders/halftone.frag'

interface HalftoneBackgroundProps {
  src: string
  frequency?: number
  className?: string
}

function HalftoneBackground({ src, frequency = 30.0, className }: HalftoneBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const textureRef = useRef<WebGLTexture | null>(null)
  const imageAspectRef = useRef<[number, number]>([1, 1])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2')
    if (!gl) {
      console.error('WebGL not supported')
      return
    }

    glRef.current = gl

    // Create shaders
    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)

    if (!vertex || !fragment) return

    // Create program
    const program = createProgram(gl, vertex, fragment)
    if (!program) return

    programRef.current = program

    // Create geometry
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )

    // Setup attributes
    const positionLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    // Load texture
    const texture = gl.createTexture()
    textureRef.current = texture

    const image = new Image()
    image.onload = () => {
      if (!glRef.current || !textureRef.current) return

      gl.bindTexture(gl.TEXTURE_2D, textureRef.current)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

      imageAspectRef.current = [image.width, image.height]
      render()
    }
    image.src = src

    function render() {
      if (!glRef.current || !programRef.current || !canvas) return

      const gl = glRef.current
      const program = programRef.current

      gl.useProgram(program)

      // Set uniforms
      const iResolutionLoc = gl.getUniformLocation(program, 'iResolution')
      const frequencyLoc = gl.getUniformLocation(program, 'frequency')
      const iImageAspectLoc = gl.getUniformLocation(program, 'iImageAspect')
      
      gl.uniform2f(iResolutionLoc, canvas.width, canvas.height)
      gl.uniform1f(frequencyLoc, frequency)
      gl.uniform2f(iImageAspectLoc, imageAspectRef.current[0], imageAspectRef.current[1])

      // Bind texture
      gl.activeTexture(gl.TEXTURE0)
      if (textureRef.current) {
        gl.bindTexture(gl.TEXTURE_2D, textureRef.current)
      }
      const uSamplerLoc = gl.getUniformLocation(program, 'u_sampler')
      gl.uniform1i(uSamplerLoc, 0)

      // Clear and draw
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // Handle resize
    const handleResize = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      render()
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [src, frequency])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

export default HalftoneBackground

