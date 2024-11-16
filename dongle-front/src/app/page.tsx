// app/page.tsx
"use client";
import { useState } from "react";
import Header from "@/components/Header";
import CreateChallengeButton from "@/components/UI/CreateChallengeButton";
import ChallengeList from "@/components/ChallengeList";
import Footer from "@/components/Footer";
import ModalContent from "@/components/UI/ModalContent";
import AddChallengeForm from "@/components/AddChallengeForm";
import { Challenge } from "@/modules/_types";

export default function Home() {
  const [showModal, setShowModal] = useState<boolean>(false);
  console.log("showModal", showModal);

  const handleChallengeCreated = (challenge: Challenge) => {
    setShowModal(false);
    // You might want to refresh the challenges list here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ModalContent handleShow={{ showModal, setShowModal }}>
        <AddChallengeForm successCb={handleChallengeCreated} />
      </ModalContent>

      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <CreateChallengeButton onClick={() => setShowModal(true)} />
        <div className="my-6 border-t border-gray-300" />
        <ChallengeList />
      </main>
      <Footer />
    </div>
  );
}
