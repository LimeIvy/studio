
import CreateCoursePage from '../page'; // Reuse the component from the parent folder

// This page structure allows for a specific route for creating a team course,
// passing the teamId as part of the URL.
// The actual rendering logic is handled by the CreateCoursePage component.
export default function CreateTeamSpecificCoursePage() {
  return <CreateCoursePage />;
}
