"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { isSupabaseConfigured } from "@/lib/env"
import { Card, CardContent, Button, Badge } from "@proof-of-fit/ui"
import { Camera, Check, Loader2, Sparkles, Upload, Linkedin } from "lucide-react"

interface ProfilePhotoCardProps {
  userId: string
  profileId?: string | number | null
  initialPhotoUrl?: string | null
  fullName?: string | null
  onPhotoChange?: (url: string | null) => void
  showStorageHint?: boolean
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export function ProfilePhotoCard({
  userId,
  profileId,
  initialPhotoUrl,
  fullName,
  onPhotoChange,
  showStorageHint = true,
}: ProfilePhotoCardProps) {
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(initialPhotoUrl ?? null)
  const [currentProfileId, setCurrentProfileId] = useState<string | number | null>(profileId ?? null)
  const [uploading, setUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusTone, setStatusTone] = useState<"success" | "error" | "info">("info")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const supabase = useMemo(() => (isSupabaseConfigured() ? createClientComponentClient() : null), [])

  const firstName = useMemo(() => {
    if (!fullName) return "there"
    const trimmed = fullName.trim()
    if (!trimmed) return "there"
    return trimmed.split(/\s+/)[0]
  }, [fullName])

  const triggerFileDialog = () => {
    if (uploading) return
    fileInputRef.current?.click()
  }

  const setStatus = (message: string | null, tone: "success" | "error" | "info" = "info") => {
    setStatusMessage(message)
    setStatusTone(tone)
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setStatus("Please upload a JPG, PNG, GIF, or WEBP image.", "error")
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setStatus("Images must be 5MB or smaller.", "error")
      return
    }

    if (!supabase) {
      setStatus("Storage is not configured. Ask an admin to connect Supabase.", "error")
      return
    }

    setUploading(true)
    setStatus("Uploading portrait…", "info")

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const safeExtension = ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)
      ? extension
      : "jpg"
    const filePath = `candidate-portraits/${userId}/profile.${safeExtension}`

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        })

      if (uploadError) {
        throw uploadError
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      let nextProfileId = currentProfileId

      if (nextProfileId) {
        const primaryUpdate = await supabase
          .from("candidate_profiles")
          .update({ photoUrl: publicUrl })
          .eq("id", nextProfileId)

        if (primaryUpdate.error) {
          const fallbackUpdate = await supabase
            .from("candidate_profiles")
            .update({ photo_url: publicUrl })
            .eq("id", nextProfileId)

          if (fallbackUpdate.error) {
            throw fallbackUpdate.error
          }
        } else {
          await supabase
            .from("candidate_profiles")
            .update({ photo_url: publicUrl })
            .eq("id", nextProfileId)
        }
      } else {
        let insertedProfileId: string | number | null = null

        const camelInsert = await supabase
          .from("candidate_profiles")
          .insert({ userId, photoUrl: publicUrl })
          .select("id")
          .single()

        if (camelInsert.error) {
          const snakeInsert = await supabase
            .from("candidate_profiles")
            .insert({ user_id: userId, photo_url: publicUrl })
            .select("id")
            .single()

          if (snakeInsert.error) {
            throw snakeInsert.error
          }

          insertedProfileId = snakeInsert.data?.id ?? null
        } else {
          insertedProfileId = camelInsert.data?.id ?? null
        }

        nextProfileId = insertedProfileId
        if (nextProfileId) {
          setCurrentProfileId(nextProfileId)
          await supabase
            .from("candidate_profiles")
            .update({ photo_url: publicUrl })
            .eq("id", nextProfileId)
          await supabase
            .from("candidate_profiles")
            .update({ photoUrl: publicUrl })
            .eq("id", nextProfileId)
        }
      }

      setCurrentPhotoUrl(publicUrl)
      setStatus("Portrait updated!", "success")
      onPhotoChange?.(publicUrl)
    } catch (error) {
      console.error("Failed to upload profile photo", error)
      setStatus("We couldn’t save that photo. Please try again.", "error")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 shadow-lg">
      <CardContent className="relative flex flex-col items-center gap-6 px-8 py-10 text-center">
        <Sparkles className="absolute left-10 top-8 h-6 w-6 text-amber-400" aria-hidden="true" />
        <Sparkles className="absolute right-12 bottom-10 h-5 w-5 text-amber-300" aria-hidden="true" />

        <div className="relative">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl">
            {currentPhotoUrl ? (
              <Image
                src={currentPhotoUrl}
                alt={`${firstName}'s profile portrait`}
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-amber-300 text-4xl font-semibold text-amber-900">
                {firstName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
            <Linkedin className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-amber-900">
            {firstName.charAt(0).toUpperCase() + firstName.slice(1)}, ready for your next role?
          </h2>
          <p className="text-sm text-amber-800">
            Give hiring teams a warm, trustworthy first impression with a professional portrait.
          </p>
        </div>

        <div className="grid gap-2 text-left text-sm text-amber-900">
          <div className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-amber-600" />
            <span>Highlight the person behind the proof.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-amber-600" />
            <span>Appear on Fit Reports and recruiter briefings.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-amber-600" />
            <span>Reuse safely across your ProofOfFit workflows.</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={triggerFileDialog}
            disabled={uploading || !supabase}
            className="min-w-[220px] bg-amber-500 text-amber-950 hover:bg-amber-600"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving portrait…
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {currentPhotoUrl ? "Replace photo" : "Upload photo"}
              </>
            )}
          </Button>
          {!supabase && showStorageHint && (
            <Badge variant="secondary" className="bg-white/60 text-amber-900">
              Connect Supabase storage to enable uploads
            </Badge>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {statusMessage && (
          <div
            className={`text-xs font-medium ${
              statusTone === "success"
                ? "text-emerald-700"
                : statusTone === "error"
                ? "text-red-700"
                : "text-amber-700"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="mt-2 flex items-center gap-2 text-xs text-amber-800">
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Tip: natural light, centered shoulders, confident smile.</span>
        </div>
      </CardContent>
    </Card>
  )
}
