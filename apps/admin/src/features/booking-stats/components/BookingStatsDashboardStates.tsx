import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@zanadeal/ui";

export function BookingStatsDashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-[420px] rounded-lg" />
    </div>
  );
}

export function BookingStatsDashboardError({
  isRetrying,
  onRetry,
}: {
  isRetrying?: boolean;
  onRetry: () => void;
}) {
  return (
    <Card className="rounded-lg border-destructive/50">
      <CardHeader>
        <CardTitle>Impossible de charger les statistiques</CardTitle>
        <CardDescription>
          Vérifie la connexion serveur puis réessaie.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled={isRetrying} onClick={() => onRetry()}>
          Réessayer
        </Button>
      </CardContent>
    </Card>
  );
}
