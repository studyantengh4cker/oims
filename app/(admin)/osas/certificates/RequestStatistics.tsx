import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RequestStatistics({ data }: { data: any }) {
  // Calculate totals
  const totalRequests = data.length;
  const goodMoralRequests = data.filter(
    (request: any) => request.certificateType === "Good Moral"
  );
  const leadershipRequests = data.filter(
    (request: any) => request.certificateType === "Leadership"
  );

  const pendingGoodMoralRequests = goodMoralRequests.filter(
    (request: any) => request.status === "Pending"
  ).length;

  const pendingLeadershipRequests = leadershipRequests.filter(
    (request: any) => request.status === "Pending"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Requests Card */}
      <Card className="bg-primary text-primary-foreground shadow-md">
        <CardHeader>
          <CardTitle>Total Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalRequests}</p>
        </CardContent>
      </Card>

      {/* Good Moral Requests Card */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Good Moral Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{goodMoralRequests.length}</p>
          <p className="text-sm text-gray-600">
            Pending: {pendingGoodMoralRequests}
          </p>
        </CardContent>
      </Card>

      {/* Leadership Requests Card */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Leadership Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{leadershipRequests.length}</p>
          <p className="text-sm text-gray-600">
            Pending: {pendingLeadershipRequests}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
