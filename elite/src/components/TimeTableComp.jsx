import React from "react";

const TimeTableComp = () => {
  // Dummy Data for Timetable
  const schedule = [
    {
      day: "Monday",
      courses: [
        { time: "8 AM - 10 AM", title: "GNS 111", venue: "AGLT", color: "bg-blue-400/70" },
        { time: "11 AM - 1 PM", title: "MAT 111", venue: "AGRIC LAB", color: "bg-red-400/70" },
        { time: "2 PM - 4 PM", title: "PHY 121", venue: "AHL", color: "bg-green-400/70" },
      ],
    },
    {
      day: "Tuesday",
      courses: [
        { time: "9 AM - 11 AM", title: "AXR 121", venue: "MPH", color: "bg-yellow-400/70" },
        { time: "12 PM - 2 PM", title: "CHM 111", venue: "LT 2", color: "bg-purple-400/70" },
        { time: "3 PM - 5 PM", title: "BIO 111", venue: "AGLT", color: "bg-pink-400/70" },
      ],
    },
    {
      day: "Wednesday",
      courses: [
        { time: "8 AM - 10 AM", title: "CHM 101", venue: "AGRIC LAB", color: "bg-teal-400/70" },
        { time: "11 AM - 1 PM", title: "AGY 111", venue: "AHL", color: "bg-orange-400/70" },
        { time: "4 PM - 6 PM", title: "Sports", venue: "MPH", color: "bg-gray-400/70" },
      ],
    },
    {
      day: "Thursday",
      courses: [
        { time: "8 AM - 10 AM", title: "BIO 101", venue: "LT 2", color: "bg-blue-400/70" },
        { time: "10 AM - 12 PM", title: "MAT 111", venue: "AGLT", color: "bg-red-400/70" },
        { time: "12 PM - 2 PM", title: "PHY 121", venue: "AGRIC LAB", color: "bg-green-400/70" },
        { time: "2 PM - 4 PM", title: "CHM 111", venue: "AHL", color: "bg-yellow-400/70" },
        { time: "4 PM - 6 PM", title: "GNS 111", venue: "MPH", color: "bg-purple-400/70" },
      ],
    },
    {
      day: "Friday",
      courses: [
        { time: "9 AM - 11 AM", title: "AGY 111", venue: "LT 2", color: "bg-pink-400/70" },
        { time: "12 PM - 2 PM", title: "CHM 101", venue: "AGLT", color: "bg-teal-400/70" },
        { time: "3 PM - 5 PM", title: "BIO 101", venue: "AGRIC LAB", color: "bg-orange-400/70" },
      ],
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 m-4 max-h-[100vh] overflow-y-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
        Weekly Timetable
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {schedule.map((day) => (
          <div key={day.day} className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-700">{day.day}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
              {day.courses.map((course, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-md text-white font-medium backdrop-blur-sm ${course.color}`}
                >
                  <p className="text-sm">{course.time}</p>
                  <p className="text-lg">{course.title}</p>
                  <p className="text-sm">Venue: {course.venue}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTableComp;
