import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Entry } from '@/lib/entries'

type EntryCardProps = {
  entry: Entry
  onEnter: (entry: Entry) => void
}

export function EntryCard({ entry, onEnter }: EntryCardProps) {
  const Icon = entry.icon

  return (
    <Card className="transition-shadow hover:ring-foreground/25 hover:shadow-md">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
          <Icon className="size-5" />
        </div>
        <CardTitle className="mt-2 text-lg">{entry.title}</CardTitle>
        <CardDescription className="leading-relaxed">
          {entry.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-1.5">
        {entry.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardContent>

      <CardContent className="mt-auto">
        <Button className="w-full" onClick={() => onEnter(entry)}>
          进入入口
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}
