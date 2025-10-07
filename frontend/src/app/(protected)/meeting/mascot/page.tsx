import MascotClient from "@/components/Meeting/MascotClient";

export default function MascotPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: "url('/assets/bg_mascot.svg')" }}
    >
      <MascotClient />
    </div>
  );
}
