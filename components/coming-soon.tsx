import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ComingSoon({ name }: { name: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        This page is not built yet.
      </CardContent>
    </Card>
  );
}