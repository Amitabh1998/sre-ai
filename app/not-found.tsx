import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <p className="text-slate-400 mt-2">Page not found</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="primary" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

