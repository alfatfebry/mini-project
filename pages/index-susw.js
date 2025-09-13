import ShowSchools from "./showSchools_old";
import Modal from "@/components/Modal";

export default function Home() {
  return (
    <>
      {/* Main schools listing */}
      <ShowSchools />

      {/* Hardcoded modal for testing */}
      <Modal />
    </>
  );
}
