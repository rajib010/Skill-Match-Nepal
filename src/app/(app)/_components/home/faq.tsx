import {
  FaqType,
  getAllFaqs,
} from "@/app/(authenticated)/dashboard/faqs/action";
import SubTitle from "@/components/sub-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Suspense } from "react";

async function FaqContent() {
  const res = await getAllFaqs();
  const qaItems = res.success ? res.data.faqs : [];

  return (
    <div className="w-full sm:max-w-[867px] mt-[60px]">
      <Accordion type="single" collapsible className="w-full">
        {Array.isArray(qaItems) &&
          qaItems.length > 0 &&
          qaItems.map((item: FaqType, idx: number) => (
            <AccordionItem
              value={item.id.toString()}
              key={item.id}
              className="border-b-gray-100"
            >
              <AccordionTrigger className="hover:no-underline text-poppins font-semibold text-base justify-between py-5 cursor-pointer">
                <div className="flex items-center">
                  <p className="font-semibold mr-8">{idx + 1}.</p>
                  <span>{item.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-12 text-gray-600 text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
}

function FaqSkeleton() {
  return (
    <div className="w-full sm:max-w-[867px] mt-[60px]">
      <div className="w-full space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-b border-gray-100 py-5">
            <div className="flex items-center animate-pulse">
              <div className="h-5 w-8 bg-gray-200 rounded mr-8"></div>
              <div className="h-5 bg-gray-200 rounded flex-1 max-w-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="my-container py-8 flex flex-col items-center">
      {/* Titles */}
      <div className="max-w-2xl text-center">
        <SubTitle title="FAQ" />
        <h1 className="section-heading mt-4">
          Confusions <span className="italic-heading">cleared</span>
        </h1>
        <p className="text-header mt-2 font-poppins">
          Everything you need to know about Skill Match Nepal, how it works, and how to find
          suitable jobs. If you don&apos;t see your question here, feel free
          to reach out.
        </p>
      </div>
      {/* QA */}
      <Suspense fallback={<FaqSkeleton />}>
        <FaqContent />
      </Suspense>
    </section>
  );
}
