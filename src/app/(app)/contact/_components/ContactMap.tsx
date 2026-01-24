"use client";

export default function MapIframe() {
  return (
    <section className="mt-15 sm:mt-28">
      <div className="relative w-full h-80 sm:h-[800px] overflow-hidden border border-slate-200 shadow-[0px_1px_3px_1px_#00000026,0px_1px_2px_0px_#0000004D] bg-slate-100 ">
        {/* Map (iframe) */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14130.359290665743!2d85.28176419553114!3d27.69906966777355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1860ae22d385%3A0x7c2444e8284cef52!2sKalimati%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1769264026266!5m2!1sen!2snp"
          width="1600"
          height="900"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
