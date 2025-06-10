import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  href: string;
  locked?: boolean;
}

const lessons: Lesson[] = [
  {
    id: "sequence",
    title: "Sequence",
    description: "Learn how to order commands step by step",
    href: "/lessons/sequence",
    locked: false,
  },
  {
    id: "advanced-sequence",
    title: "Advanced Sequence",
    description: "Complex sequences",
    href: "/lessons/advanced-sequence",
    locked: true,
  },
  {
    id: "loop",
    title: "Loop",
    description: "Repeat actions automatically",
    href: "/lessons/loop",
    locked: true,
  },
  {
    id: "advanced-loop",
    title: "Advanced Loop",
    description: "Complex loops and dynamic iteration",
    href: "/lessons/advanced-loop",
    locked: true,
  },
  {
    id: "conditional-loop",
    title: "Conditional Loop",
    description: "Repeat actions based on a condition",
    href: "/lessons/conditional-loop",
    locked: true,
  },
  {
    id: "advanced-conditional-loop",
    title: "Advanced Conditional Loop",
    description: "Complex conditions and loop combinations",
    href: "/lessons/advanced-conditional-loop",
    locked: true,
  },
  {
    id: "procedure",
    title: "Procedure",
    description: "Group commands into reusable blocks",
    href: "/lessons/procedure",
    locked: true,
  },

  {
    id: "advanced-procedure",
    title: "Advanced Procedure",
    description: "Building multi-step procedures and modular code",
    href: "/lessons/advanced-procedure",
    locked: true,
  },
];

export const LessonList: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Coding Lessons for Junior</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) =>
          lesson.locked ? (
            <div
              key={lesson.id}
              className="opacity-50 cursor-not-allowed hover:shadow-none transition-shadow duration-200"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-xl">{lesson.title}</CardTitle>
                    <Lock size={16} />
                  </div>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <div className="px-6 pb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    15 Levels →
                  </span>
                </div>
              </Card>
            </div>
          ) : (
            <Link
              key={lesson.id}
              to="/lessons/$lesson"
              params={{ lesson: lesson.id }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl">{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <div className="px-6 pb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    15 Levels →
                  </span>
                </div>
              </Card>
            </Link>
          ),
        )}
      </div>
    </div>
  );
};
