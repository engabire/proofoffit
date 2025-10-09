"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@proof-of-fit/ui"
import { Download } from "lucide-react"

type ProfilePhotoPreviewProps = {
  photoUrl?: string | null
  displayName?: string | null
  className?: string
}

const VIEWBOX_WIDTH = 800
const VIEWBOX_HEIGHT = 560
const AVATAR_CENTER_X = 400
const AVATAR_CENTER_Y = 270
const AVATAR_RADIUS = 120
const AVATAR_STROKE_WIDTH = 24

export function ProfilePhotoPreview({ photoUrl, displayName, className }: ProfilePhotoPreviewProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [renderUrl, setRenderUrl] = useState<string | null>(null)

  const initials = useMemo(() => {
    if (!displayName) return "?"
    const trimmed = displayName.trim()
    if (!trimmed) return "?"
    return trimmed.charAt(0).toUpperCase()
  }, [displayName])

  // Normalize provided photo URL to a data URL when possible to avoid CORS issues when exporting
  useEffect(() => {
    let isCancelled = false

    if (!photoUrl) {
      setRenderUrl(null)
      return
    }

    if (photoUrl.startsWith("data:")) {
      setRenderUrl(photoUrl)
      return
    }

    const normalize = async () => {
      try {
        const response = await fetch(photoUrl, { mode: "cors" })
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`)
        }
        const blob = await response.blob()
        const reader = new FileReader()

        reader.onload = () => {
          if (!isCancelled) {
            setRenderUrl(typeof reader.result === "string" ? reader.result : photoUrl)
          }
        }
        reader.onerror = () => {
          if (!isCancelled) {
            setRenderUrl(photoUrl)
          }
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        console.warn("Could not normalize photo URL", error)
        if (!isCancelled) {
          setRenderUrl(photoUrl)
        }
      }
    }

    normalize()

    return () => {
      isCancelled = true
    }
  }, [photoUrl])

  const handleExport = useCallback(async () => {
    if (!svgRef.current) return

    setIsExporting(true)
    setExportError(null)

    try {
      const svgElement = svgRef.current
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgElement)
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      await new Promise<void>((resolve, reject) => {
        const image = new Image()
        const viewBox = svgElement.viewBox.baseVal
        const width = viewBox?.width || VIEWBOX_WIDTH
        const height = viewBox?.height || VIEWBOX_HEIGHT

        image.crossOrigin = "anonymous"
        image.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const context = canvas.getContext("2d")

          if (!context) {
            reject(new Error("Canvas context unavailable"))
            return
          }

          context.drawImage(image, 0, 0, width, height)
          URL.revokeObjectURL(svgUrl)

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("Unable to create PNG blob"))
              return
            }

            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = downloadUrl
            link.download = "proof-of-fit-profile-frame.png"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(downloadUrl)
            resolve()
          })
        }

        image.onerror = () => {
          URL.revokeObjectURL(svgUrl)
          reject(new Error("Image export failed"))
        }

        image.src = svgUrl
      })
    } catch (error) {
      console.error("Failed to export profile background", error)
      setExportError("We couldn't generate the image. Try again or upload a different photo.")
    } finally {
      setIsExporting(false)
    }
  }, [])

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-[48px] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-4 shadow-xl">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
            className="h-auto w-[min(640px,100vw)]"
            role="img"
            aria-label="LinkedIn-ready profile background preview"
          >
            <defs>
              <linearGradient id="profile-card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff6e8" />
                <stop offset="50%" stopColor="#fde0b5" />
                <stop offset="100%" stopColor="#f5c37c" />
              </linearGradient>
              <linearGradient id="profile-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8e6b0" />
                <stop offset="100%" stopColor="#d48c27" />
              </linearGradient>
              <radialGradient id="profile-placeholder" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#f8d9a4" />
                <stop offset="100%" stopColor="#e3a83d" />
              </radialGradient>
              <clipPath id="profile-photo-clip">
                <circle
                  cx={AVATAR_CENTER_X}
                  cy={AVATAR_CENTER_Y}
                  r={AVATAR_RADIUS - AVATAR_STROKE_WIDTH / 2}
                />
              </clipPath>
              <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#f4c06a" floodOpacity="0.25" />
              </filter>
            </defs>

            <rect
              x={70}
              y={60}
              width={VIEWBOX_WIDTH - 140}
              height={VIEWBOX_HEIGHT - 120}
              rx={48}
              fill="url(#profile-card-bg)"
              filter="url(#card-shadow)"
            />

            {/* Decorative sparkles */}
            <g fill="#e8aa33">
              <circle cx="180" cy="180" r="6" opacity="0.7" />
              <circle cx="220" cy="360" r="4" opacity="0.6" />
              <circle cx="580" cy="170" r="5" opacity="0.6" />
            </g>
            <g fill="#f5b644" opacity="0.8">
              <path d="M0 -14 L10 0 0 14 -10 0 Z" transform="translate(400 120)" />
              <path d="M0 -10 L7 0 0 10 -7 0 Z" transform="translate(640 260)" />
            </g>

            {/* Profile circle with gradient ring */}
            <circle
              cx={AVATAR_CENTER_X}
              cy={AVATAR_CENTER_Y}
              r={AVATAR_RADIUS}
              fill="#fff"
              stroke="url(#profile-ring)"
              strokeWidth={AVATAR_STROKE_WIDTH}
            />

            <g clipPath="url(#profile-photo-clip)">
              {renderUrl ? (
                <image
                  x={AVATAR_CENTER_X - (AVATAR_RADIUS - AVATAR_STROKE_WIDTH / 2)}
                  y={AVATAR_CENTER_Y - (AVATAR_RADIUS - AVATAR_STROKE_WIDTH / 2)}
                  height={(AVATAR_RADIUS - AVATAR_STROKE_WIDTH / 2) * 2}
                  width={(AVATAR_RADIUS - AVATAR_STROKE_WIDTH / 2) * 2}
                  preserveAspectRatio="xMidYMid slice"
                  href={renderUrl}
                />
              ) : (
                <>
                  <rect
                    x={AVATAR_CENTER_X - (AVATAR_RADIUS - AVATAR_STROKE_WIDTH / 2)}
                    y={AVATAR_CENTER_Y - (AVATAR_RADIUS - AVATAR_STROKE_WIDTH / 2)}
                    width={(AVATAR_RADIUS - AVATAR_STROKE_WIDTH / 2) * 2}
                    height={(AVATAR_RADIUS - AVATAR_STROKE_WIDTH / 2) * 2}
                    fill="url(#profile-placeholder)"
                  />
                  <text
                    x={AVATAR_CENTER_X}
                    y={AVATAR_CENTER_Y + 8}
                    textAnchor="middle"
                    fontFamily="'Inter', 'Helvetica', 'Arial', sans-serif"
                    fontWeight="700"
                    fontSize="96"
                    fill="#8b5d0a"
                  >
                    {initials}
                  </text>
                </>
              )}
            </g>

            {/* LinkedIn badge */}
            <g transform="translate(480 360)">
              <rect width="96" height="96" rx="28" fill="#dd952c" />
              <text
                x="48"
                y="58"
                textAnchor="middle"
                fontSize="48"
                fontFamily="'Inter', 'Helvetica', 'Arial', sans-serif"
                fontWeight="700"
                fill="#fff"
              >
                in
              </text>
            </g>
          </svg>
        </div>

        <Button onClick={handleExport} disabled={isExporting} className="bg-amber-600 text-white hover:bg-amber-700">
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Preparing image…" : "Download LinkedIn background"}
        </Button>
        {exportError && <p className="text-sm text-red-600">{exportError}</p>}
      </div>
    </div>
  )
}
