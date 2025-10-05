import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { demoUser, demoProfile, demoBullets } from '@/lib/demo-data'
import { ProfilePhotoCard } from '@/components/candidate/profile-photo-card'

export default function CandidateProfileDemoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your professional information and evidence
          </p>
        </div>
        <Button asChild>
          <Link href="/candidate/profile/edit">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <ProfilePhotoCard
        userId={demoUser.id}
        profileId={demoProfile.id}
        initialPhotoUrl={demoProfile.photoUrl}
        fullName={demoUser.email.split('@')[0]}
        showStorageHint={false}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>
              Your basic information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm">{demoUser.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Work Preferences</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {demoProfile.preferences.workType.map((type) => (
                  <Badge key={type} variant="secondary">{type}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preferred Locations</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {demoProfile.preferences.location.map((loc) => (
                  <Badge key={loc} variant="outline">{loc}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evidence Bullets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Evidence Bullets</CardTitle>
                <CardDescription>
                  Your professional achievements and skills
                </CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/candidate/profile/bullets/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bullet
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoBullets.map((bullet) => (
                <div key={bullet.id} className="p-3 border rounded-lg">
                  <p className="text-sm mb-2">{bullet.text}</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(bullet.tags).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/candidate/profile/bullets/${bullet.id}/edit`}>
                        <Edit className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Preferences</CardTitle>
            <CardDescription>
              How employers can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Direct Contact</label>
              <p className="text-sm">
                {demoProfile.contactPolicy.allowDirectContact ? 'Allowed' : 'Not allowed'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preferred Method</label>
              <p className="text-sm">{demoProfile.contactPolicy.preferredMethod}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Availability</label>
              <p className="text-sm">{demoProfile.contactPolicy.availability}</p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Demo Mode</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              This is a demonstration of the ProofOfFit candidate profile system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              In the full application, this would connect to Supabase for real data storage and retrieval.
              The system includes AI-powered job matching, resume tailoring, and application tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
