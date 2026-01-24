"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import {
  contactSchema,
  ContactSchemaType,
} from "@/app/(authenticated)/dashboard/contact/schema";
import { sendContactMessage } from "@/app/(authenticated)/dashboard/contact/actions";
import { GOOGLE_RECAPTCHA_SITE_KEY } from "@/config";
import  ReCAPTCHA  from "react-google-recaptcha";

type Props = {
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
};
const data: Props = {
  city: "Kathmandu",
  country: "Nepal",
  phone: "9800000000",
  email: "admin@skillmatch.com.np",
};

function InquiryForm() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<ContactSchemaType>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const { isSubmitting, isDirty } = form.formState;

  const onSubmit = async (values: ContactSchemaType) => {
    if (GOOGLE_RECAPTCHA_SITE_KEY && !captchaToken) {
      toast.error("Please verify recaptcha.");
      return;
    }

    if (captchaToken) {
      const res = await sendContactMessage(values, captchaToken);
      const { success, message } = res;

      if (success) {
        toast.success(message);
        form.reset();
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
        return;
      }

      toast.error(message);
      return;
    } else {
      toast.error("Invalid captcha token.");
      return;
    }
  };

  return (
    <Card
      id="contactForm"
      className="rounded-2xl border border-slate-200 shadow-[0px_1px_3px_1px_#00000026,0px_1px_2px_0px_#0000004D] py-0"
    >
      <CardContent className="p-3 sm:p-6 font-poppins">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Top row: Name / Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-header text-base font-normal">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          placeholder="Your name here."
                          className="h-11 rounded-full bg-secondary/30 border-secondary/30 placeholder:text-header/80 placeholder:font-light placeholder:text-base "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-header text-base font-normal">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          type="email"
                          placeholder="Ex : abc@gmail.com"
                          className="h-11 rounded-full bg-secondary/30 border-secondary/30 placeholder:text-header/80 placeholder:font-light placeholder:text-base "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-header text-base font-normal">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isSubmitting}
                        placeholder="Message.."
                        className="min-h-[140px] rounded-2xl bg-secondary/30 border-secondary/30  placeholder:text-header/80 placeholder:font-light placeholder:text-base resize-y max-h-[140px] overflow-y-scroll"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* recaptcha */}

            {GOOGLE_RECAPTCHA_SITE_KEY && (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={GOOGLE_RECAPTCHA_SITE_KEY}
                onChange={(token: string | null) => setCaptchaToken(token)}
                className="mt-5"
              />
            )}

            {/* Submit aligned right */}
            <div className="flex md:justify-end pt-2">
              <Button
                type="submit"
                className="rounded-full bg-primary hover:bg-primary-foreground px-6 h-11 font-poppins hover:text-primary"
                disabled={isSubmitting || !isDirty}
              >
                Submit Inquiry{" "}
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Send className="ml-2" strokeWidth={1.75} />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ContactForm() {
  return (
    <section className="mt-[100px] px-5 lg:px-0 m-auto grid grid-cols-1 sm:grid-cols-4 gap-5 sm:gap-2 lg:gap-5 max-w-7xl">
      <Card className="relative border border-slate-200 shadow-[0px_1px_3px_1px_#00000026,0px_1px_2px_0px_#0000004D] rounded-2xl overflow-hidden py-0 ">
        {/* add right padding so text doesn't collide with big logo */}
        <CardContent className="font-poppins p-3 lg:p-6">
          <div className="space-y-8 sm:space-y-4">
            <div>
              <p className="text-primary font-semibold text-base sm:text-xl  mb-1">
                Location
              </p>
              <p className="text-header">
                {data.city}, {data.country}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-primary font-semibold text-base sm:text-xl ">
                Contact
              </p>
              <p className="text-header">{data.phone}</p>
              <p className="text-header">{data.email}</p>
            </div>
          </div>
        </CardContent>

        {/* Bigger vertical logo watermark on the right */}
        <div className="pointer-events-none select-none absolute right-4 bottom-5 w-28 md:w-40 lg:w-56 h-28 md:h-40 lg:h-56">
          <div className="relative h-full w-full">
            <Image
              src="/logo.svg"
              alt=""
              fill
              className="object-contain object-right-bottom opacity-20 -rotate-90"
              sizes="(min-width: 1024px) 14rem, (min-width: 768px) 10rem, 7rem"
              priority
            />
          </div>
        </div>
      </Card>

      <div className="col-span-1 sm:col-span-3">
        <InquiryForm />
      </div>
    </section>
  );
}
