import { prisma } from "@/lib/db";
import { hmac } from "@/lib/hash";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Watermark } from "@/components/audit/Watermark";
import { ReportLayout } from "@/components/briefings/ReportLayout";
import { OnePagerLayout } from "@/components/briefings/OnePagerLayout";
import { PortfolioLayout } from "@/components/briefings/PortfolioLayout";

interface AuditPageProps {
  params: {
    token: string;
  };
}

async function getAuditData(token: string) {
  const link = await prisma.auditLink.findUnique({
    where: { token },
    include: {
      target: {
        include: {
          weights: {
            include: {
              proof: true,
            },
          },
        },
      },
    },
  });

  if (!link) {
    return null;
  }

  // Check if link is expired or revoked
  if (link.isRevoked) {
    return null;
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return null;
  }

  // Check view limits
  if (link.maxViews && link.viewsCount >= link.maxViews) {
    return null;
  }

  return link;
}

async function recordView(token: string, headers: Headers) {
  const userAgent = headers.get("user-agent") || "";
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

  const viewerHash = hmac(userAgent);
  const ipHash = hmac(ip);

  await prisma.auditView.create({
    data: {
      auditLinkId: (await prisma.auditLink.findUnique({ where: { token } }))!.id,
      viewerHash,
      ipHash,
      uaHash: hmac(userAgent),
    },
  });

  // Update view count
  await prisma.auditLink.update({
    where: { token },
    data: {
      viewsCount: {
        increment: 1,
      },
    },
  });
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { token } = params;
  const headersList = headers();

  const link = await getAuditData(token);

  if (!link) {
    notFound();
  }

  // Record the view
  await recordView(token, headersList);

  const proofs = link.target.weights
    .filter((w) => w.weight > 0)
    .map((w) => w.proof)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const LayoutComponent = {
    REPORT: ReportLayout,
    ONE_PAGER: OnePagerLayout,
    PORTFOLIO: PortfolioLayout,
  }[link.target.layout];

  return (
    <div className="min-h-screen bg-white">
      <LayoutComponent target={link.target} proofs={proofs} />
      {link.watermark && (
        <Watermark text={`${link.target.title} - ProofOfFit`} />
      )}
    </div>
  );
}

export async function generateMetadata({ params }: AuditPageProps) {
  const { token } = params;
  
  const link = await prisma.auditLink.findUnique({
    where: { token },
    include: {
      target: true,
    },
  });

  if (!link) {
    return {
      title: "Audit Link Not Found",
    };
  }

  return {
    title: `${link.target.title} - Evidence Board`,
    description: `Evidence board for ${link.target.role} at ${link.target.companyHint || "target company"}`,
  };
}
