"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusIcon } from "lucide-react";
import { testimonialSchema, TestimonialSchemaType } from "../schema";
import {
  addNewTestimonial,
  TestimonialType,
  updateTestimonialInfo,
} from "../action";
import { Textarea } from "@/components/ui/textarea";
import {
  handleNumberScroll,
  preventDecimalKeys,
} from "@/app/(authenticated)/utils";

interface iAppProps {
  open: boolean;
  onClose: () => void;
  selectedTestimonial?: TestimonialType;
}

export default function TestimonialForm({
  open,
  onClose,
  selectedTestimonial = null,
}: iAppProps) {
  const router = useRouter();
  const form = useForm<TestimonialSchemaType>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      id: "",
      name: "",
      address: "",
      message: "",
      rating: "",
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  useEffect(() => {
    if (selectedTestimonial) {
      form.reset({
        id: selectedTestimonial.id || "",
        name: selectedTestimonial.name || "",
        address: selectedTestimonial.address || "",
        rating: String(selectedTestimonial.rating) || "",
        message: selectedTestimonial.message || "",
      });
    } else {
      form.reset({
        id: "",
        name: "",
        address: "",
        message: "",
        rating: "",
      });
    }
  }, [selectedTestimonial, form]);

  async function onSubmit(data: TestimonialSchemaType) {
    try {
      const result = selectedTestimonial
        ? await updateTestimonialInfo(data)
        : await addNewTestimonial(data);

      if (result.success) {
        toast.success(result.message);
        onClose();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(
        `Failed to ${selectedTestimonial ? "updat˝e" : "create"} testimonial.`
      );
    }
  }

  return (
    <Dialog open={open} modal onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => {
          if (isDirty) {
            e.preventDefault();
            return;
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isDirty) {
            e.preventDefault();
            return;
          }
        }}
        className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            {selectedTestimonial
              ? "Update Testimonial Info"
              : "Add New Testimonial"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/*  Name */}
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* address */}

              <div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Address <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* rating */}

              <div>
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Rating <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          max={5}
                          min={0}
                          disabled={isSubmitting}
                          onKeyDown={preventDecimalKeys}
                          onWheel={handleNumberScroll}
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* message */}

              <div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Message <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write message"
                          rows={10}
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? (
                selectedTestimonial ? (
                  <>
                    Update Testimonial <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>
                    Add Testimonial <Loader2 className="animate-spin" />
                  </>
                )
              ) : selectedTestimonial ? (
                "Update Testimonial"
              ) : (
                <>
                  Add Testimonial <PlusIcon />
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
