import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const announcements = [
  {
    id: 1,
    title: "System Maintenance",
    description:
      "The system will undergo maintenance on December 30th from 1:00 AM to 5:00 AM.",
    date: "December 27, 2024",
  },
  {
    id: 2,
    title: "New Joining",
    description: "New employees will be joining the company on January 1st, 2025.",
    date: "December 26, 2024",
  },
  {
    id: 3,
    title: "New Feature Release",
    description:
      "Introducing the new analytics dashboard for better performance insights.",
    date: "December 25, 2024",
  },
  {
    id: 4,
    title: "Server Upgrade",
    description:
      "The server will be upgraded to the latest version on January 1st, 2025.",
    date: "December 24, 2024",
  },
  {
    id: 5,
    title: "New Launch",
    description:
      "The Vehicle will be launched on January 1st, 2025.",
    date: "December 24, 2024",
  },
];

const AnnouncementDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Latest Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <ul className="list-disc list-inside space-y-3">
              {announcements.map((announcement) => (
                <li key={announcement.id}>
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-sm text-gray-600">
                    {announcement.description}
                  </p>
                  <p className="text-xs text-gray-400">{announcement.date}</p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementDashboard;
