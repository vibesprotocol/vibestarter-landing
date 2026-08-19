import { Kinetics } from "@/experience/editorial/Kinetics";
import { EdHero } from "@/experience/editorial/EdHero";
import { EdGap } from "@/experience/editorial/EdGap";
import { EdSchedule } from "@/experience/editorial/EdSchedule";
import { EdChallengeWindow } from "@/experience/editorial/EdChallengeWindow";
import { EdProvenance } from "@/experience/editorial/EdProvenance";
import { EdReputation } from "@/experience/editorial/EdReputation";
import { EdBuiltIn } from "@/experience/editorial/EdBuiltIn";
import { EdLaunch } from "@/experience/editorial/EdLaunch";
import { EdJournal } from "@/experience/editorial/EdJournal";
import { FooterNew } from "@/experience/ui/FooterNew";
import { HudFrame } from "@/experience/ui/HudFrame";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Kinetics />
      <EdHero />
      <EdGap />
      <EdSchedule />
      <EdChallengeWindow />
      <EdProvenance />
      <EdReputation />
      <EdBuiltIn />
      <EdLaunch />
      <EdJournal />
      <FooterNew />
      <HudFrame />
    </main>
  );
}
