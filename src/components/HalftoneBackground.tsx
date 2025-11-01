import { useEffect, useRef } from 'react'
import vertexShader from '../shaders/basic.vert'
import fragmentShader from '../shaders/halftone.frag'

interface HalftoneBackgroundProps {
  src: string
  frequency?: number
  saturation?: number
  className?: string
}

function HalftoneBackground({ src, frequency = 30.0, saturation = 1.0, className }: HalftoneBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const textureRef = useRef<WebGLTexture | null>(null)
  const imageAspectRef = useRef<[number, number]>([1, 1])
  const imageLoadedRef = useRef(false)
  const resolutionMultiplierRef = useRef(3)
  const lastSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })

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
      imageLoadedRef.current = true
      // Render immediately, then resize to ensure proper canvas dimensions
      render()
      // Trigger resize after image loads to ensure proper sizing
      requestAnimationFrame(() => {
        handleResize()
      })
    }
    image.src = src

    function render() {
      if (!glRef.current || !programRef.current || !canvas || !textureRef.current || !imageLoadedRef.current) return

      const gl = glRef.current
      const program = programRef.current

      gl.useProgram(program)

      // Get display size (CSS size) for cover calculations - use rounded values
      const rect = canvas.getBoundingClientRect()
      const displayWidth = Math.round(rect.width)
      const displayHeight = Math.round(rect.height)

      // Set uniforms
      const iResolutionLoc = gl.getUniformLocation(program, 'iResolution')
      const frequencyLoc = gl.getUniformLocation(program, 'frequency')
      const iImageSizeLoc = gl.getUniformLocation(program, 'iImageSize')
      const saturationLoc = gl.getUniformLocation(program, 'saturation')
      
      // Use display resolution (CSS size) for cover calculations, not internal canvas resolution
      // Use rounded integers to avoid sub-pixel issues
      gl.uniform2f(iResolutionLoc, displayWidth, displayHeight)
      // Frequency should be based on display size, NOT internal resolution
      // Scaling frequency by resolution multiplier causes severe moiré
      gl.uniform1f(frequencyLoc, frequency)
      gl.uniform2f(iImageSizeLoc, imageAspectRef.current[0], imageAspectRef.current[1])
      gl.uniform1f(saturationLoc, saturation)

      // Bind texture
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, textureRef.current)
      const uSamplerLoc = gl.getUniformLocation(program, 'u_sampler')
      gl.uniform1i(uSamplerLoc, 0)

      // Clear and draw
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // Handle resize - can be called directly or via ResizeObserver
    const handleResize = (entries?: ResizeObserverEntry[]) => {
      if (!canvas) return
      
      // Use the entry size if available, otherwise fall back to getBoundingClientRect
      let displayWidth: number
      let displayHeight: number
      
      if (entries && entries.length > 0) {
        // Use ResizeObserver entry for accurate size
        const entry = entries[0]
        displayWidth = Math.round(entry.contentRect.width)
        displayHeight = Math.round(entry.contentRect.height)
      } else {
        // Fallback to getBoundingClientRect
        const rect = canvas.getBoundingClientRect()
        displayWidth = Math.round(rect.width)
        displayHeight = Math.round(rect.height)
      }
      
      // Skip if size is invalid or hasn't actually changed
      if ((displayWidth === 0 && displayHeight === 0) ||
          (lastSizeRef.current.width === displayWidth && 
           lastSizeRef.current.height === displayHeight)) {
        return
      }
      
      lastSizeRef.current = { width: displayWidth, height: displayHeight }
      
      // Use devicePixelRatio * 2 for clean scaling that reduces moiré
      // Power-of-2 multipliers align better with browser downsampling
      const dpr = window.devicePixelRatio || 1
      const resolutionMultiplier = Math.max(2, Math.round(dpr * 2)) // 2x, 4x, or 6x typically
      resolutionMultiplierRef.current = resolutionMultiplier
      
      // Set canvas internal resolution higher for finer detail
      canvas.width = displayWidth * resolutionMultiplier
      canvas.height = displayHeight * resolutionMultiplier
      
      // Set canvas CSS size to maintain display size (use exact integers)
      // This is needed because canvas.width/height changes the element's intrinsic size
      canvas.style.width = displayWidth + 'px'
      canvas.style.height = displayHeight + 'px'
      
      render()
    }

    // Reset image loaded flag when src changes
    imageLoadedRef.current = false
    
    // Delay initial resize to ensure canvas has been laid out
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        handleResize()
      })
    })
    
    // Set up ResizeObserver to watch both canvas and parent
    const resizeObserver = new ResizeObserver((entries) => {
      handleResize(entries)
    })
    
    // Observe the canvas itself - ResizeObserver will detect when its size changes
    resizeObserver.observe(canvas)
    
    // Also observe parent if available (as backup)
    const parentElement = canvas.parentElement
    if (parentElement) {
      resizeObserver.observe(parentElement)
    }
    
    // Also listen to window resize as a fallback
    const windowResizeHandler = () => handleResize()
    window.addEventListener('resize', windowResizeHandler)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', windowResizeHandler)
    }
  }, [src, frequency, saturation])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ 
        display: 'block', 
        width: '100%', 
        height: '100%',
        // Use auto rendering for smoother scaling - crisp-edges can cause more moiré
        imageRendering: 'auto',
        // Hint GPU acceleration
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
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

