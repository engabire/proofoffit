import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  homeIcon?: boolean
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator, homeIcon = true, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
        {...props}
      >
        {homeIcon && items.length > 0 && (
          <>
            <a
              href="/"
              className="flex items-center hover:text-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </a>
            {separator || <ChevronRight className="h-4 w-4" />}
          </>
        )}
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.href && !item.current ? (
              <a
                href={item.href}
                className="hover:text-foreground transition-colors"
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  item.current
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span aria-hidden="true">
                {separator || <ChevronRight className="h-4 w-4" />}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    )
  }
)

Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb }