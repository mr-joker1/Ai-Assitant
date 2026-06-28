"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Play, CheckCircle, Lock, Star, BookOpen, RefreshCw, ChevronRight, Award } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  xpReward: number;
  lessons: { id: string; title: string; sequenceOrder: number }[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-primary/10 text-primary",
  Intermediate: "bg-accent/10 text-accent",
  Advanced: "bg-destructive/10 text-destructive",
};

export default function LearningAcademy() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Course | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    fetch("/api/learning")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const completeLesson = async (courseId: string, lessonId: string) => {
    if (completedLessons.has(lessonId)) return;
    setCompleting(lessonId);
    try {
      const res = await fetch("/api/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId, quizScore: 100 }),
      });
      const data = await res.json();
      if (res.ok) {
        setCompletedLessons((prev) => new Set([...prev, lessonId]));
        setTotalXP((prev) => prev + (data.xpEarned || 50));
      }
    } catch (err) {
    } finally {
      setCompleting(null);
    }
  };

  const level = Math.floor(totalXP / 200) + 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading courses...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Learning Academy</h2>
          <p className="text-muted-foreground text-sm">
            Master Islamic finance, Shariah screening methods, and investment principles.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card px-4 py-2.5 rounded-xl border border-border">
          <Award className="w-4 h-4 text-accent" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Level {level}</p>
            <p className="text-sm font-bold text-foreground">{totalXP} XP</p>
          </div>
        </div>
      </div>

      {/* XP Progress bar */}
      {totalXP > 0 && (
        <div className="bg-card rounded-xl border border-border p-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress to Level {level + 1}</span>
            <span>{totalXP % 200} / 200 XP</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-primary h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((totalXP % 200) / 200) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-2xl border border-border">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="font-semibold text-foreground">No courses available yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            An administrator needs to seed the learning content first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course List */}
          <div className="lg:col-span-1 space-y-3">
            {courses.map((course) => {
              const completed = course.lessons.filter((l) => completedLessons.has(l.id)).length;
              const progress = course.lessons.length > 0 ? (completed / course.lessons.length) * 100 : 0;

              return (
                <button
                  key={course.id}
                  onClick={() => setSelected(course)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    selected?.id === course.id
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border hover:border-primary/20 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", DIFFICULTY_COLORS[course.difficulty] || "bg-secondary text-muted-foreground")}>
                      {course.difficulty}
                    </span>
                    <span className="text-[10px] text-accent font-bold">+{course.xpReward} XP</span>
                  </div>
                  <p className="font-semibold text-foreground text-sm line-clamp-2">{course.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{course.category} · {course.duration}min</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>{completed}/{course.lessons.length} lessons</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Course Detail & Lessons */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", DIFFICULTY_COLORS[selected.difficulty])}>
                      {selected.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">{selected.duration} minutes</span>
                    <span className="text-xs text-accent font-bold">+{selected.xpReward} XP</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{selected.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
                </div>

                <div className="border-t border-border pt-5 space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lessons</h4>
                  {selected.lessons.sort((a, b) => a.sequenceOrder - b.sequenceOrder).map((lesson, idx) => {
                    const isDone = completedLessons.has(lesson.id);
                    const isCompleting = completing === lesson.id;

                    return (
                      <div key={lesson.id} className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                        isDone ? "bg-primary/5 border-primary/20" : "bg-secondary/40 border-border"
                      )}>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                            isDone ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
                          )}>
                            {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className="text-sm font-medium text-foreground">{lesson.title}</span>
                        </div>
                        <button
                          onClick={() => completeLesson(selected.id, lesson.id)}
                          disabled={isDone || !!completing}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                            isDone
                              ? "bg-primary/10 text-primary cursor-default"
                              : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                          )}
                        >
                          {isCompleting ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : isDone ? (
                            <>
                              <CheckCircle className="w-3 h-3" /> Completed
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" /> Complete
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                <BookOpen className="w-12 h-12 text-primary/30 mb-4" />
                <h3 className="font-semibold text-foreground">Select a Course</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Choose a course to view its lessons, track progress, and earn XP rewards.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
