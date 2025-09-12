import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function CandidateProfilePage() {
  const userData = await getCurrentUserWithProfile()
  const supabase = createServerComponentClient({ cookies })

  if (!userData) {
    return <div>Loading...</div>
  }

  // Get candidate profile
  const { data: profile } = await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('userId', userData.user.id)
    .single()

  // Get candidate bullets
  const { data: bullets } = await supabase
    .from('bullets')
    .select('*')
    .eq('candidateId', profile?.id)
    .order('createdAt', { ascending: false })

  // Get credentials
  const { data: credentials } = await supabase
    .from('credentials')
    .select('*')
    .eq('candidateId', profile?.id)
    .order('issuedOn', { ascending: false })

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
              <p className="text-sm">{userData.user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Work Preferences</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile?.preferences?.workType?.map((type: string) => (
                  <Badge key={type} variant="secondary">{type}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preferred Locations</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile?.preferences?.location?.map((loc: string) => (
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
              {bullets?.map((bullet) => (
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
              {(!bullets || bullets.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No evidence bullets yet. Add your first one to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Credentials */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Credentials</CardTitle>
                <CardDescription>
                  Your certifications and qualifications
                </CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/candidate/profile/credentials/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credential
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {credentials?.map((cred) => (
                <div key={cred.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{cred.type}</h4>
                      <p className="text-sm text-muted-foreground">{cred.issuer}</p>
                      {cred.issuedOn && (
                        <p className="text-xs text-muted-foreground">
                          Issued: {new Date(cred.issuedOn).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {cred.verified && (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      )}
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {(!credentials || credentials.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No credentials added yet.
                </p>
              )}
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
                {profile?.contactPolicy?.allowDirectContact ? 'Allowed' : 'Not allowed'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preferred Method</label>
              <p className="text-sm">{profile?.contactPolicy?.preferredMethod || 'Email'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Availability</label>
              <p className="text-sm">{profile?.contactPolicy?.availability || 'Business hours'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}