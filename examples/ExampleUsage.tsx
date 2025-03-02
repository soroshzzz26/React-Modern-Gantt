import React, { useState } from 'react';
import { GanttChart, Person, Task } from 'react-modern-gantt';

const ExampleGanttChart: React.FC = () => {
  // Example data
  const [people, setPeople] = useState<Person[]>([
    {
      id: "1",
      name: "Alice Johnson",
      role: "Frontend Developer",
      tasks: [
        {
          id: "task-1",
          name: "Website Redesign",
          startDate: new Date(2023, 0, 1), // January 1, 2023
          endDate: new Date(2023, 2, 15),  // March 15, 2023
          color: "bg-emerald-500",
          percent: 100
        },
        {
          id: "task-2",
          name: "Mobile Responsiveness",
          startDate: new Date(2023, 3, 1),  // April 1, 2023
          endDate: new Date(2023, 4, 30),   // May 30, 2023
          color: "bg-violet-500",
          percent: 80
        }
      ]
    },
    {
      id: "2",
      name: "Bob Smith",
      role: "Backend Developer",
      tasks: [
        {
          id: "task-3",
          name: "API Development",
          startDate: new Date(2023, 1, 15), // February 15, 2023
          endDate: new Date(2023, 3, 15),   // April 15, 2023
          color: "bg-blue-500",
          percent: 90
        },
        {
          id: "task-4",
          name: "Database Optimization",
          startDate: new Date(2023, 4, 1),  // May 1, 2023
          endDate: new Date(2023, 5, 30),   // June 30, 2023
          color: "bg-orange-500",
          percent: 40
        }
      ]
    },
    {
      id: "3",
      name: "Charlie Brown",
      role: "Project Manager",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      tasks: [
        {
          id: "task-5",
          name: "Planning Phase",
          startDate: new Date(2023, 0, 1),  // January 1, 2023
          endDate: new Date(2023, 0, 31),   // January 31, 2023
          color: "bg-red-500",
          percent: 100
        },
        {
          id: "task-6",
          name: "Implementation Oversight",
          startDate: new Date(2023, 1, 1),  // February 1, 2023
          endDate: new Date(2023, 5, 30),   // June 30, 2023
          color: "bg-gray-500",
          percent: 65
        }
      ]
    }
  ]);

  // Handle task updates
  const handleTaskUpdate = (personId: string, updatedTask: Task) => {
    setPeople(currentPeople =>
      currentPeople.map(person =>
        person.id === personId
          ? {
              ...person,
              tasks: person.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
              )
            }
          : person
      )
    );
  };

  // Handle task clicks
  const handleTaskClick = (task: Task, person: Person) => {
    console.log(`Clicked on task ${task.name} belonging to ${person.name}`);
    // You could open a modal or show details in a sidebar
  };

  // Custom theme (optional)
  const customTheme = {
    headerBackground: "bg-indigo-50",
    headerText: "text-indigo-800",
    timelineBackground: "bg-gray-50",
    timelineBorder: "border-indigo-100",
    todayMarkerColor: "bg-indigo-500"
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Project Timeline</h1>

      <GanttChart
        people={people}
        title="Q1-Q2 2023 Development Roadmap"
        onTaskUpdate={handleTaskUpdate}
        onTaskClick={handleTaskClick}
        theme={customTheme}
        showCurrentDateMarker={true}
        currentDate={new Date(2023, 3, 15)} // April 15, 2023
        columnWidth={180}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Legend</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-emerald-500 rounded mr-2"></div>
            <span>Website Redesign</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-violet-500 rounded mr-2"></div>
            <span>Mobile Responsiveness</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span>API Development</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
            <span>Database Optimization</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span>Planning Phase</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
            <span>Implementation Oversight</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleGanttChart;
