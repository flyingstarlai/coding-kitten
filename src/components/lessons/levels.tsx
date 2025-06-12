import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { levelMapper } from "@/game/constans.ts";

interface Level {
  id: string;
  number: number;
}

export const Levels: React.FC = () => {
  const levels: Level[] = levelMapper.map((level, i) => ({
    id: level.id,
    number: i + 1,
  }));
  const { lesson } = useParams({ strict: false });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Lesson Levels</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {levels.map((level) => (
          <Card
            key={level.id}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader>
              <CardTitle>Level {level.number}</CardTitle>
              <CardDescription>
                Complete the exercises for Level {level.number}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                to="/lessons/$lesson/play"
                params={{ lesson: lesson! }}
                search={{ level: level.id }}
              >
                <Button variant="outline" className="w-full">
                  Play Level
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
