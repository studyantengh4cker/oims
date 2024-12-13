import { Button } from "@/components/ui/button";
import { departments } from "@/lib/globals";
import { SchoolEvent } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function EventCollegeData({
  events,
}: {
  events: SchoolEvent[];
}) {
  // Count events and incomplete events per department
  const eventCounts = departments.map((department) => {
    const departmentEvents = events.filter(
      (event) => event.colorId === department.colorId
    );
    const incompleteCount = departmentEvents.filter(
      (event) =>
        !event.hasPostActivityRequirements || !event.hasEvaluationReport
    ).length;

    return {
      ...department,
      totalCount: departmentEvents.length,
      incompleteCount,
    };
  });

  // Total incomplete events across all departments
  const totalIncompleteEvents = events.filter(
    (event) => !event.hasPostActivityRequirements || !event.hasEvaluationReport
  ).length;

  return (
    <section className="flex gap-6">
      {/* Total Events */}
      <div className="bg-primary text-primary-foreground p-8 rounded-lg drop-shadow-lg flex flex-col justify-center gap-10">
        <div>
          <h1>Total Events</h1>
          <h1 className="text-lg font-bold">{events.length}</h1>
        </div>
        <div>
          <h1>Total Incomplete</h1>
          <h1 className="text-lg font-bold">{totalIncompleteEvents}</h1>
        </div>
        <Button asChild variant="link">
          <Link href="/reports/events" className="text-primary-foreground">
            View Report
          </Link>
        </Button>
      </div>

      {/* Events by Department */}
      <div className="flex flex-wrap gap-4">
        {eventCounts.map((department, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start gap-4"
          >
            <Image
              src={department.logo}
              alt={`${department.name} logo`}
              width={60}
              height={60}
            />
            <div>
              <h2 className="font-bold">{department.shortname}</h2>
              <p>{department.totalCount} Total Event(s)</p>
              <p className="text-red-500">
                {department.incompleteCount} Incomplete Event(s)
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
