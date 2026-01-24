import ContactForm from "./_components/ContactForm";
import ContactMap from "./_components/ContactMap";

export const dynamic = "force-dynamic";

export default async function Contact() {
  return (
    <main>
      <section className="my-container mt-[50px]">
        {/* Titles */}
        <div className="w-full flex flex-col">
          <div className="max-w-2xl px-16">
            <h1 className="section-heading mt-4 ">
              Let&apos;s <span className="italic-heading">connect.</span>
            </h1>
            <p className="text-header mt-2 font-poppins">
              Have questions about our services, looking for your next job, or
              just want to learn more? Send us a message — we&apos;d love to
              hear from you.`
            </p>
          </div>
        </div>
      </section>
      <ContactForm />
      <ContactMap />
    </main>
  );
}
