/*  This file contains the main page component for the PT Break Timer application, which renders the Timer component.
* Written by James Hutchings, 2026-08-06
*/

import { Timer } from "@/components/Timer";

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <Timer defaultIntervalMinutes={30} />
    </main>
  );
}