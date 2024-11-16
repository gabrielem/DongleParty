// app/page.tsx
"use client";
import { useState } from "react";
import Header from "@/components/Header";
import CreateChallengeButton from "@/components/UI/CreateChallengeButton";
import Footer from "@/components/Footer";
import ModalContent from "@/components/UI/ModalContent";
import AddChallengeForm from "@/components/AddChallengeForm";
import ChallengesList from "@/components/ChallengesList";

export default function Home() {
  const [show, setShow] = useState<boolean>(false);

  const handleChallengeCreated = (challenge: any) => {
    setShow(false);
    // You might want to refresh the challenges list here
  };
  const handleToggleChallengeForm = (e: any) => {
    e.preventDefault();
    setShow(!show);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ModalContent handleShow={{ show, setShow }}>
        <AddChallengeForm successCb={handleChallengeCreated} />
      </ModalContent>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <CreateChallengeButton onClick={handleToggleChallengeForm} />

        <ChallengesList />
      </main>
      <Footer />
    </div>
  );
}
