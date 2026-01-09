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
import { Loader2 } from "lucide-react";
import { faqsSchema, FaqSchemaType } from "../schema";
import { Textarea } from "@/components/ui/textarea";
import { addNewFaq, FaqType, updateFaqInfo } from "../action";

interface iAppProps {
  open: boolean;
  onClose: () => void;
  selectedFaq?: FaqType | null;
}

export default function ManageFaqForm({
  open,
  onClose,
  selectedFaq,
}: iAppProps) {
  const router = useRouter();

  const form = useForm<FaqSchemaType>({
    resolver: zodResolver(faqsSchema),
    defaultValues: {
      id: "",
      question: "",
      answer: "",
    },
  });

  const { isDirty, isSubmitting } = form.formState;

  useEffect(() => {
    if (selectedFaq) {
      form.reset({
        id: selectedFaq.id,
        question: selectedFaq.question,
        answer: selectedFaq.answer,
      });
    } else {
      form.reset({
        id: "",
        question: "",
        answer: "",
      });
    }
  }, [selectedFaq, form]);

  async function onSubmit(data: FaqSchemaType) {
    try {
      const result = selectedFaq
        ? await updateFaqInfo(data)
        : await addNewFaq(data);

      if (result.success) {
        toast.success(result.message);
        onClose();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(`Failed to ${selectedFaq ? "update" : "create"} faq.`);
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
        className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            {selectedFaq ? "Update Faq Info" : "Add New Faq"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Faq Question */}
              <div>
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Question
                        <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the question"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Faq Answer */}
              <div>
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Answer
                        <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={20}
                          placeholder="Enter the answer"
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
                selectedFaq ? (
                  <>
                    Update FAQ <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>
                    Add FAQ <Loader2 className="animate-spin" />
                  </>
                )
              ) : selectedFaq ? (
                "Update Faq"
              ) : (
                "Add Faq"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
